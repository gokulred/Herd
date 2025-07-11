<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('admin', function ($user) {
    return $user->is_admin;
});