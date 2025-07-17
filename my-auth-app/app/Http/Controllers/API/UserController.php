<?php

namespace App\Http\Controllers;

use App\Models\User; // Make sure to import your User model
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        // Find the user by their ID. findOrFail will automatically
        // return a 404 Not Found response if the ID doesn't exist.
        $user = User::findOrFail($id);

        // Laravel automatically converts the Eloquent model to JSON.
        return response()->json($user);
    }
}