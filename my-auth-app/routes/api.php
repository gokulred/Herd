<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'index']);
    Route::put('/users/{user}/approve', [AdminController::class, 'approve']);
    Route::put('/users/{user}/block', [AdminController::class, 'block']);
    Route::delete('/users/{user}', [AdminController::class, 'destroy']);
});