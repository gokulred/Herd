<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            // 'email_verified_at' => now(), // REMOVE THIS LINE
            'password' => static::$password ??= Hash::make('password'),
            'account_type' => 'Individual', // ADD A DEFAULT VALUE
            'status' => 'approved', // ADD A DEFAULT VALUE
            'remember_token' => Str::random(10),
        ];
    }
}