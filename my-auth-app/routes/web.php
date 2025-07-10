<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// --- Start of fix ---

// This will catch all other routes and return the main view.
// This allows React Router to handle the routing.
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');

// --- End of fix ---