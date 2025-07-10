<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
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

        // Create the user with a 'pending' status
        $user = User::create([
            'name' => $name,
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'account_type' => $account_type,
            'status' => 'pending', // Default status for new registrations
        ]);

        // Create a profile if the account is not 'Individual'
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

        // Return a success message indicating approval is needed
        return response()->json([
            'message' => 'Registration successful! Your account is pending approval by an administrator.',
        ], 201);
    }

    /**
     * Authenticate the user and return a token.
     */
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

        $user = auth()->user();

        // **CRITICAL FIX**: Check the user's status
        if ($user->status !== 'approved') {
            auth()->logout(); // Log out the user immediately
            return response()->json(['message' => 'Your account is not approved or has been blocked.'], 403);
        }

        return response()->json([
            'message' => 'Login successful!',
            'user' => $user->load('profile'),
            'token' => $user->createToken('auth_token')->plainTextToken,
        ]);
    }
}