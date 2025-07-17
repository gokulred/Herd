<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // --- Start of Fix ---
        // Use firstOrCreate to prevent duplicate entries
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Master Admin',
                'password' => Hash::make('password'),
                'account_type' => 'Individual',
                'is_admin' => true,
                'status' => 'approved',
            ]
        );

        // Get the "Admin" role
        $adminRole = \App\Models\Role::where('name', 'Admin')->first();

        // Attach the role to the user if not already attached
        if ($adminRole && !$user->roles->contains($adminRole->id)) {
            $user->roles()->attach($adminRole->id);
        }
        // --- End of Fix ---
    }
}