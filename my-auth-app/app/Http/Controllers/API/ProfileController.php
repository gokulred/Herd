<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $rules = [
            'street' => ['sometimes', 'required', 'string', 'max:255'],
            'city' => ['sometimes', 'required', 'string', 'max:255'],
            'state' => ['sometimes', 'required', 'string', 'max:255'],
            'zip_code' => ['sometimes', 'required', 'string', 'max:20'],
            'phone' => ['sometimes', 'required', 'string', 'max:20'],
        ];

        $userData = $request->only(['street', 'city', 'state', 'zip_code', 'phone']);

        if ($user->account_type === 'Individual') {
            $rules['first_name'] = ['sometimes', 'required', 'string', 'max:255'];
            $rules['last_name'] = ['sometimes', 'required', 'string', 'max:255'];
            $userData['first_name'] = $request->input('first_name');
            $userData['last_name'] = $request->input('last_name');
            $userData['name'] = $request->input('first_name') . ' ' . $request->input('last_name');
        } else {
            $rules['name'] = ['sometimes', 'required', 'string', 'max:255'];
            $rules['business_name'] = ['sometimes', 'required', 'string', 'max:255'];
            $userData['name'] = $request->input('name');
            $userData['business_name'] = $request->input('business_name');
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($userData);

        return response()->json([
            'message' => 'Profile updated successfully!',
            'user' => $user,
        ]);
    }
}