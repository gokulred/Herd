<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AdminAuthController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\ShowController;
use App\Http\Controllers\API\BookingController;

// --- Public Routes ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// Publicly view all shows and individual show details
Route::get('/shows', [ShowController::class, 'index']);
Route::get('/shows/{show}', [ShowController::class, 'show']);


// --- Authenticated Routes ---
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/profile', [ProfileController::class, 'update']);

    // Authenticated actions for shows
    Route::post('/shows', [ShowController::class, 'store']);
    Route::get('/my-shows', [ShowController::class, 'myShows']);

    // Bookings require authentication
    Route::post('/shows/{show}/bookings', [BookingController::class, 'store']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    Route::get('/shows/{show}/bookings', [BookingController::class, 'showBookings']);
});


// --- Admin Routes ---
Route::middleware(['auth:sanctum', 'role:Admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'index']);
    Route::put('/users/{user}/approve', [AdminController::class, 'approve']);
    Route::put('/users/{user}/block', [AdminController::class, 'block']);
    Route::delete('/users/{user}', [AdminController::class, 'destroy']);
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/users/{user}/roles', [RoleController::class, 'assignRole']);
    Route::delete('/users/{user}/roles/{role}', [RoleController::class, 'revokeRole']);
});
