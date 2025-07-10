<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return User::where('is_admin', false)->get();
    }

    public function approve(User $user)
    {
        $user->update(['status' => 'approved']);
        return response()->json(['message' => 'User approved successfully.']);
    }

    public function block(User $user)
    {
        $user->update(['status' => 'blocked']);
        return response()->json(['message' => 'User blocked successfully.']);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully.']);
    }
}