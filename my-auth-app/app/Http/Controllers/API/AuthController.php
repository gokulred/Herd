<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $account_type = $request->input('account_type');

        $rules = [
            'account_type' => ['required', 'in:Individual,Private Business,Organisation,Company,Institution'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'street' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'zip_code' => ['nullable', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:20'],
        ];

        if ($account_type === 'Individual') {
            $rules['first_name'] = ['required', 'string', 'max:255'];
            $rules['last_name'] = ['required', 'string', 'max:255'];
            $name = $request->input('first_name') . ' ' . $request->input('last_name');
        } else {
            $rules['contact_person'] = ['required', 'string', 'max:255'];
            $rules['business_name'] = ['required', 'string', 'max:255'];
            $name = $request->input('contact_person');
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $name,
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'account_type' => $account_type,
        ]);

        if ($account_type !== 'Individual') {
            $user->profile()->create([
                'business_name' => $request->input('business_name'),
                'street' => $request->input('street'),
                'city' => $request->input('city'),
                'state' => $request->input('state'),
                'zip_code' => $request->input('zip_code'),
                'phone' => $request->input('phone'),
            ]);
        }

        // Log the new user in immediately
        auth()->login($user);

        // Return the user and a new token
        return response()->json([
            'message' => 'Registration successful!',
            'user' => $user->load('profile'),
            'token' => $user->createToken('auth_token')->plainTextToken,
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!auth()->attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = User::where('email', $request->email)->first();

        return response()->json([
            'message' => 'Login successful!',
            'user' => $user->load('profile'),
            'token' => $user->createToken('auth_token')->plainTextToken,
        ]);
    }
}