<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Get all available roles.
     */
    public function index()
    {
        return Role::all();
    }

    /**
     * Assign a role to a user.
     */
    public function assignRole(Request $request, User $user)
    {
        $request->validate(['role_id' => 'required|exists:roles,id']);
        $user->roles()->syncWithoutDetaching($request->role_id);
        return response()->json(['message' => 'Role assigned successfully.']);
    }

    /**
     * Revoke a role from a user.
     */
    public function revokeRole(User $user, Role $role)
    {
        $user->roles()->detach($role->id);
        return response()->json(['message' => 'Role revoked successfully.']);
    }
}