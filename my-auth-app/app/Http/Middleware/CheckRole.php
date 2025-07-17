<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        $user = $request->user();
        if ($user && $user->roles()->where('name', $role)->exists()) {
            return $next($request);
        }
        return response()->json(['message' => 'Unauthorized'], 403);
    }
} 