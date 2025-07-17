<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role The role to check for.
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $role)
    {
        $user = $request->user();

        // --- Start of Fix ---
        // The check now correctly uses the $role variable passed to the middleware.
        if ($user && $user->roles()->where('name', $role)->exists()) {
            return $next($request);
        }
        // --- End of Fix ---

        return response()->json(['message' => 'Unauthorized. You do not have the required role.'], 403);
    }
}
