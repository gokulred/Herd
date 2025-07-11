<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('is_admin', false);

        // Search filter for name or email
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }
        if ($status = $request->query('status')) {
            // The UI uses 'active', but the database uses 'approved'
            $dbStatus = $status === 'active' ? 'approved' : $status;
            if (in_array($dbStatus, ['pending', 'approved', 'blocked'])) {
                $query->where('status', $dbStatus);
            }
        }
        return $query->latest()->get();
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