<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // In my-auth-app/app/Http/Controllers/API/AuthController.php

    // In my-auth-app/app/Http/Controllers/API/AuthController.php

    public function register(Request $request)
    {
        // --- Start of a more robust fix ---

        // Primary validation for common fields
        $primaryValidator = Validator::make($request->all(), [
            'account_type' => ['required', 'in:Individual,Private Business,Organisation,Company,Institution'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($primaryValidator->fails()) {
            return response()->json(['errors' => $primaryValidator->errors()], 422);
        }

        // Secondary, conditional validation
        $account_type = $request->input('account_type');
        if ($account_type === 'Individual') {
            $secondaryValidator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255'],
            ]);
        } else {
            $secondaryValidator = Validator::make($request->all(), [
                'contact_person' => ['required', 'string', 'max:255'],
                'business_name' => ['required', 'string', 'max:255'],
            ]);
        }

        if ($secondaryValidator->fails()) {
            return response()->json(['errors' => $secondaryValidator->errors()], 422);
        }

        // Create the user
        $user = User::create([
            'name' => $request->input('name') ?? $request->input('contact_person'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'account_type' => $account_type,
        ]);

        // --- End of a more robust fix ---

        // If it's a business/org, create the profile entry
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

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Registration successful!',
            'user' => $user->load('profile')
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
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
        ]);
    }
}