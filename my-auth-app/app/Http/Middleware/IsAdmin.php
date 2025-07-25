<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        // Check if user has 'Admin' role via roles relationship
        if ($user && $user->roles()->where('name', 'Admin')->exists()) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }
}