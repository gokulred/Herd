<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Show;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ShowController extends Controller
{
    public function index()
    {
        return Show::with('user')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'date' => 'required|date',
            'time' => 'required',
            'venue' => 'required|string|max:255',
            'ticket_price' => 'required|numeric',
        ]);

        $imagePath = $request->file('image')->store('shows', 'public');

        $show = $request->user()->shows()->create([
            'title' => $request->title,
            'content' => $request->content,
            'image_path' => $imagePath,
            'date' => $request->date,
            'time' => $request->time,
            'venue' => $request->venue,
            'ticket_price' => $request->ticket_price,
        ]);

        return response()->json($show, 201);
    }

    /**
     * Fetch shows created by the authenticated user.
     */
    public function myShows(Request $request)
    {
        return $request->user()->shows()->latest()->get();
    }

    public function show(Show $show)
    {
        return $show->load('user');
    }
}
