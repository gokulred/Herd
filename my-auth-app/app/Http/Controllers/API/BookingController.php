<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Show;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request, Show $show)
    {
        $request->validate([
            'tickets' => 'required|integer|min:1',
        ]);

        $booking = $show->bookings()->create([
            'user_id' => $request->user()->id,
            'tickets' => $request->tickets,
        ]);

        return response()->json($booking, 201);
    }

    public function myBookings(Request $request)
    {
        return $request->user()->bookings()->with('show.user')->latest()->get();
    }

    public function showBookings(Request $request, Show $show)
    {
        if ($request->user()->id !== $show->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $show->bookings()->with('user')->latest()->get();
    }
}
