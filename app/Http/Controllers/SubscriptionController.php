<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Notifications\SubscriptionNotification;
use App\Services\EmailNotificationService;
use Illuminate\Http\Request;
use SoDe\Extend\Text;

class SubscriptionController extends BasicController
{
    public $model = Subscription::class;

    public function beforeSave(Request $request)
    {
        $provider = Text::getEmailProvider($request->email);
        $subscription = $this->model::select('id')->where('description', $request->email)->first();
        return [
            'id' => $subscription->id ?? null,
            'name' => $provider,
            'description' => $request->email
        ];
    }

    public function afterSave(Request $request, $jpa, ?bool $isNew)
    {


          $jpa->notify(new SubscriptionNotification($jpa));
    }
}
