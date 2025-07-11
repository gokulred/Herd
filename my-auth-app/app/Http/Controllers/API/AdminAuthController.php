<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminAuthController extends Controller
{
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

        // **CRITICAL CHECK**: Ensure the user is an admin
        if (!$user->is_admin) {
            auth()->logout(); // Log out the non-admin user
            return response()->json(['message' => 'Access denied. Not an administrator.'], 403);
        }

        $user->last_login_at = now();
        $user->last_login_ip = $request->ip();
        $user->save();

        return response()->json([
            'message' => 'Admin login successful!',
            'user' => $user,
            'token' => $user->createToken('admin_auth_token')->plainTextToken,
        ]);
    }
}