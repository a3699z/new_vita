<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Http\Facades\Auth;
use App\Http\Facades\Database;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Mail\ReservationBookedEmployee;
use App\Mail\ReservationBookedPatient;
// use Google\Rpc\Context\AttributeContext\Response;
use Illuminate\Support\Facades\Mail;
// inertia response
use Inertia\Response as InertiaResponse;
// response
use Illuminate\Http\Response;


class ReservationController extends Controller
{

    /**
     * check reservation
     */
    public function check(Request $request): RedirectResponse
    {
        // validate request
        $request->validate([
            'employeeUID' => 'required',
            // 'date' => 'required',
            // 'hour' => 'required',
            'time' => 'required',
        ]);
        // $time = 2024-07-21 08:15

        $date = date('Y-m-d', strtotime($request->time));
        $hour = date('H:i', strtotime($request->time));
        $reservation = array(
            'employee_uid' => $request->employeeUID,
            'date' => $date,
            'hour' => $hour,
            'is_online' => $request->online
        );
        $request->session()->put('reservation', $reservation);
        if (!$request->online) {
            $check = $this->onsite_reservation_exists($request->session()->get('reservation'), $request->employeeUID);
        } else {
            $check = $this->reservation_exists($request->session()->get('reservation'), $request->employeeUID);
        }
        if ($check) {
            $request->session()->forget('reservation');
            return Redirect::back()->with('error', 'Reservation already exists for the selected date and time');
        }
        if (Auth::check()) {
            return Redirect::route('reservation.create');
        } else {
            return Redirect::route('login', ['ref' => 'reserve']);
        }
    }

    public function create(Request $request)
    {
        // dd($request->session()->get('reservation'));
        if (!$request->session()->has('reservation')) {
            return Redirect::route('site.index');
        }
        // $check = $this->reservation_exists($request->session()->get('reservation'), $request->session()->get('reservation')['employee_uid']);
        // if ($check) {
        //     $request->session()->forget('reservation');
        //     return Redirect::back()->with('error', 'Reservation already exists for the selected date and time');
        // }
        $reservation_session = $request->session()->get('reservation');
        // dd($reservation_session);
        // $employee = Auth::getUserData($reservation_session['employee_uid']);
        if (is_array($reservation_session) && isset($reservation_session['employee_uid'])) {
            $employee = Auth::getUserData($reservation_session['employee_uid']);
        } else {
            // Handle the case where $reservation_session is not an array or does not contain 'employee_uid'
            // For example, redirect back with an error message
            return Redirect::back()->with('error', 'Invalid reservation session data');
        }
        // dd($employee);
        return Inertia::render('Reservation/Create/index', [
            'employee' => $employee,
            'date' => $reservation_session['date'],
            'hour' => $reservation_session['hour'],
            'is_online' => $reservation_session['is_online']
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'insurance_type' => 'required',
            'insurance_policy_number' => 'required',
            'is_online' => 'required',
            'employee_uid' => 'required',
            'date' => 'required',
            'hour' => 'required',
        ]);
        // dd($request->all());
        try {
            $check = $this->reservation_exists(array(
                'employee_uid' => $request->employee_uid,
                'date' => $request->date,
                'hour' => $request->hour
            ), $request->employee_uid);
            if ($check) {
                $request->session()->forget('reservation');
                return Redirect::back()->with('error', 'Reservation already exists for the selected date and time');
            }

            $employee = Auth::getUserData($request->employee_uid);
            $reservation = [
                'user_uid' => Auth::getUID(),
                'employee_uid' => $employee['uid'],
                'date' => $request->date,
                'hour' => $request->hour,
                'insurance_type' => $request->insurance_type,
                'insurance_policy_number' => $request->insurance_policy_number,
                'is_online' => $request->is_online ? true : false,
                'status' => 'pending'
            ];
            $reservation = Database::push('reservations', $reservation);
            // $request->session()->forget('reservation');

            // $reservation = Database::getOneReference('reservations/'.$reservation->getKey());
            $reservation_key = $reservation->getKey();
            $reservation = $reservation->getValue();


            $patient = Auth::getUserData();

            // dd($reservation, $employee, $patient);

            // dd($reservation, $employee, $patient);

            // Mail::to($employee['email'])->send(new ReservationBookedEmployee($reservation, $employee, $patient));

            // Mail::to(Auth::getUserData()['email'])->send(new ReservationBookedPatient($reservation, $patient, $employee));

            // this date blocked_hours
            $blocked_hours = Database::get('users/'.$employee['uid'].'/blocked_hours/'.$reservation['date']);
            if (is_array($blocked_hours)) {
                $blocked_hours[] = $reservation['hour'];
            } else {
                $blocked_hours = [$reservation['hour']];
            }
            Database::set('users/'.$employee['uid'].'/blocked_hours/'.$reservation['date'], $blocked_hours);

            Mail::send('mail.resbooked_employee', [
                'reservation' => $reservation,
                'employee' => $employee,
                'patient' => $patient
            ], function ($message) use ($employee, $patient) {
                $message->to($employee['email'], $employee['name'])->subject('Reservation Booked');
                $message->to($patient['email'], $patient['name'])->subject('Reservation Booked');
            });

            Mail::send('mail.resbooked_patient', [
                'reservation' => $reservation,
                'employee' => $employee,
                'patient' => $patient
            ], function ($message) use ($employee, $patient) {
                $message->to($employee['email'], $employee['name'])->subject('Reservation Booked');
                $message->to($patient['email'], $patient['name'])->subject('Reservation Booked');
            });

            // dd('alsdkjflsd');
            // dd($reservation);

            // return send the reservation key to the frontend make the flash persistent
            // return Redirect::back()->with(['success' => 'Reservation booked successfully', 'reservation' => $reservation_key]);
            // return Redirect::back()->keep(['success' => 'Reservation booked successfully', 'reservation' => $reservation_key]);

            // return a response with the reservation key
            // return Response::json([
            //     'message' => 'Reservation booked successfully',
            //     'reservation' => $reservation_key
            // ]);
            // return response()->json([
            //     'message' => 'Reservation booked successfully',
            //     'reservation' => $reservation_key
            // ]);

            // using inertia response
            return Inertia::render('Reservation/Create/index', [
                'employee' => $employee,
                'date' => $reservation['date'],
                'hour' => $reservation['hour'],
                'is_online' => $reservation['is_online'],
                'success' => 'Reservation booked successfully',
                'reservation_key' => $reservation_key
            ]);

        } catch (\Exception $e) {
            // return Redirect::back()->with('error', 'Error occured while booking reservation');
            // return response()->json([
            //     'message' => 'Error occured while booking reservation',
            //     'error' => $e->getMessage()
            // ], 500);
            return Inertia::render('Reservation/Create/index', [
                'employee' => $employee,
                'date' => $reservation['date'],
                'hour' => $reservation['hour'],
                'is_online' => $reservation['is_online'],
                'error' => 'Error occured while booking reservation',
                'error_message' => $e->getMessage()
            ]);
        }
        // $data = [
        //     'message' => 'Reservation booked successfully',
        //     'reservation' => $reservation->getKey()
        // ];
    }

    public function reservation_exists($reservation = [], $uid) {
        $blocked_hours = $this->database->getReference('/users/'.$reservation['employee_uid'].'/blocked_hours/'.$reservation['date'])->getValue();
        // dd($blocked_hours);
        if (is_array($blocked_hours)) {
            if (in_array($reservation['hour'], $blocked_hours)) {
                return true;
            }
            switch (date('i', strtotime($reservation['hour']))) {
                case '15':
                    if (in_array(date('H:i', strtotime($reservation['hour'] . ' -15 minutes')), $blocked_hours)) {
                        return true;
                    }
                    break;
                case '30':
                    if (in_array(date('H:i', strtotime($reservation['hour'] . ' -30 minutes')), $blocked_hours)) {
                        return true;
                    }
                    break;
                case '45':
                    if (in_array(date('H:i', strtotime($reservation['hour'] . ' -45 minutes')), $blocked_hours)) {
                        return true;
                    }
                    break;
            }
        }
        return false;
    }

    public function onsite_reservation_exists($reservation, $uid)
    {
        $uid = $reservation['employee_uid'];

        $blocked_hours = Database::get('users/'.$uid.'/blocked_hours/'.$reservation['date']);


        if (is_array($blocked_hours)) {
            if ($min = date('i', strtotime($reservation['hour'])) == '30') {
                if (in_array(date('H:i', strtotime($reservation['hour'] . ' -30 minutes')), $blocked_hours)) {
                    return true;
                }
            }
        }

        $reservations = Database::getWhere('reservations', 'employee_uid', $uid);

        foreach ($reservations as $res) {
            if ($res['date'] == $reservation['date'] && $res['hour'] == $reservation['hour']) {
                return true;
            }
            if ($min = date('i', strtotime($reservation['hour'])) == '30') {
                $hour = date('H:i', strtotime($reservation['hour'] . ' -30 minutes'));
                if ($res['date'] == $reservation['date'] && $res['hour'] == $hour && $res['is_online']) {
                    return true;
                }
            }
            // else {
            //     $hour = date('H:i', strtotime($reservation['hour'] . ' +30 minutes'));
            //     if ($res['date'] == $reservation['date'] && $res['hour'] == $hour) {
            //         return true;
            //     }
            // }
        }
    }

    public function index ( Request $request )
    {
        if (Auth::employee()) {
            $reservations = Database::getWhere('reservations', 'employee_uid', Auth::getUID());
            $reservations = array_map(function ($reservation) {
                $reservation['reservation_with'] = Auth::getUserData($reservation['user_uid']);
                return $reservation;
            }, $reservations);
        } else {
            $reservations = Database::getWhere('reservations', 'user_uid', Auth::getUID());
            $reservations = array_map(function ($reservation) {
                $reservation['reservation_with'] = Auth::getUserData($reservation['employee_uid']);
                return $reservation;
            }, $reservations);
        }
        return Inertia::render('Reservation/Index', [
            'reservations' => $reservations
        ]);
    }



    public function accept (Request $request, $key)
    {
        Database::set('reservations/'.$key.'/status', 'accepted');
        $reservation = Database::getOneReference('reservations/'.$key);
        if ($reservation['is_online']) {
            $reservation['reservation_with'] = Auth::getUserData($reservation['user_uid']);
            $call = [
                'employee_uid' => $reservation['employee_uid'],
                'patient_uid' => $reservation['user_uid'],
                'date' => $reservation['date'],
                'hour' => $reservation['hour'],
                'reservation_key' => $key,
                'room_name' => 'call_'.$key,
                'topic' => 'Call with '.$reservation['reservation_with']['name'].' on '.$reservation['date'].' at '.$reservation['hour'].'.'
            ];
            Database::push('calls', $call);
        }
        return Redirect::back()->with('status', 'Reservation accepted');
    }

    public function decline (Request $request, $key)
    {
        Database::delete('reservations/'.$key);
        return Redirect::back()->with('status', 'Reservation declined');
    }

    public function get_hours(Request $request)
    {
        $date = $request->date;
        $type = $request->type;
        $employee_uid = $request->employeeUID;

        $hours = [];
        $hour = '08:00';
        $end_hour = '15:00';
        // $reservations = Database::getWhere('reservations', 'employee_uid', $employee_uid);
        while (strtotime($hour) <= strtotime($end_hour)) {
            // foreach ($reservations as $reservation) {
            //     if (($reservation['date'] == $date && $reservation['hour'] == $hour) || (strtotime($date . ' ' . $hour) < time())) {
            //         break;
            //     }
            // }
            // $hours[] = $hour;
            // $hour = date('H:i', strtotime($hour . ' +60 minutes'));
            // if ($type == 'onsite') {
            //     $hour = date('H:i', strtotime($hour . ' +30 minutes'));
            // } else {
            //     $hour = date('H:i', strtotime($hour . ' +60 minutes'));
            // }

            if ($type == 'onsite') {
                $check = $this->onsite_reservation_exists(array(
                    'employee_uid' => $employee_uid,
                    'date' => $date,
                    'hour' => $hour
                ), $employee_uid);
                if (!$check) {
                    $hours[] = $hour;
                }
                $hour = date('H:i', strtotime($hour . ' +30 minutes'));
            } else {
                $check = $this->reservation_exists(array(
                    'employee_uid' => $employee_uid,
                    'date' => $date,
                    'hour' => $hour
                ), $employee_uid);
                if (!$check) {
                    $hours[] = $hour;
                }
                $hour = date('H:i', strtotime($hour . ' +60 minutes'));
            }



        }
        return response()->json([
            'hours' => $hours
        ]);
    }

    public function cancel(Request $request)
    {
        $key = $request->key;
        $call = Database::getOneWhere('calls', 'reservation_key', $key);
        if ($call) {
            Database::delete('calls/'.$call['key']);
        }
        Database::delete('reservations/'.$key);
        return Redirect::route('profile.index')->with('status', 'Reservation cancelled');
    }

    public function quick(Request $request)
    {
        // $uid = strval($uid);
        // dd($uid);
        // $request->session()->put('quick_reservation', [
        //     'employee_uid' => $uid,
        // ]);

        // if (!Auth::check()) {
        //     return Redirect::route('login', ['ref' => 'quick_reserve']);
        // } else {

        //     if (!$request->session()->has('quick_reservation')) {
        //         return Redirect::route('site.index');
        //     }

        //     $reservation_session = $request->session()->get('quick_reservation');
        //     $employee = Auth::getUserData($reservation_session['employee_uid']);
        //     return Inertia::render('Reservation/Quick/index', [
        //         'employee' => $employee,
        //     ]);

        // }

        // get the first available date and time
        // $employee = Auth::getUserData($uid);
        // dd(gettype($uid));
        // time gmt +2

        $uid = $request->employeeUID;
        $date = date('Y-m-d');
        $data = $this->quick_hour($date, $uid);
        if (empty($data['hour'])) {
            return Redirect::back()->with('error', 'No available time for today');
        }
        $reservation = array(
            'employee_uid' => $uid,
            'date' => $data['date'],
            'hour' => $data['hour'],
            'is_online' => true,
        );
        $request->session()->put('reservation', $reservation);
        $check = $this->reservation_exists($request->session()->get('reservation'), $request->employeeUID);
        if ($check) {
            $request->session()->forget('reservation');
            return Redirect::back()->with('error', 'Reservation already exists for the selected date and time');
        }
        if (Auth::check()) {
            return Redirect::route('reservation.create');
        } else {
            return Redirect::route('login', ['ref' => 'reserve']);
        }
    }

    public function quick_hour($date, $uid) {
        $start_hour = '08:00';
        $end_hour = '15:00';
        if (strtotime(date('H:i')) > strtotime('15:00')) {
            $date = date('Y-m-d', strtotime($date . ' +1 day'));
        }
        $hour = '';
        // dd($date, $hour, $end_hour);
        $reservations = Database::getWhere('reservations', 'employee_uid', $uid);
        while (strtotime($start_hour) <= strtotime($end_hour)) {
            $isBooked = false;

            foreach ($reservations as $reservation) {
                if ($reservation['date'] == $date && $reservation['hour'] == $start_hour) {
                    $isBooked = true;
                    break;
                }
            }
            if ($isBooked) {
                $start_hour = date('H:i', strtotime($start_hour . ' +60 minutes'));
            } else {
                $hour = $start_hour;
                break;
            }
        }
        if (empty($hour)) {
            $hour = $this->quick_hour(date('Y-m-d', strtotime($date . ' +1 day')), $uid);
        }
        return array(
            'hour' => $hour,
            'date' => $date
        );
    }

    public function quick_store(Request $request): RedirectResponse
    {
        $request->validate([
            'insurance_type' => 'required',
            'insurance_policy_number' => 'required',
            'employee_uid' => 'required',
        ]);

        try {
            $employee = Auth::getUserData($request->employee_uid);
            $quick_reservation = [
                'user_uid' => Auth::getUID(),
                'employee_uid' => $employee['uid'],
                'insurance_type' => $request->insurance_type,
                'insurance_policy_number' => $request->insurance_policy_number,
            ];
            $quick_reservation = Database::push('quick_reservations', $quick_reservation);
            $request->session()->forget('quick_reservation');

            $quick_reservation = $quick_reservation->getValue();

            $patient = Auth::getUserData();


            // Mail::to($employee['email'])->send(new QuickReservationBookedEmployee($quick_reservation, $employee, $patient));

            // Mail::to(Auth::getUserData()['email'])->send(new QuickReservationBookedPatient($quick_reservation, $patient, $employee));

            Mail::send('emails.quick_reservation', [
                'quick_reservation' => $quick_reservation,
                'employee' => $employee,
                'patient' => $patient
            ], function ($message) use ($employee, $patient) {
                $message->to($employee['email'], $employee['name'])->subject('Quick Reservation Booked');
                $message->to($patient['email'], $patient['name'])->subject('Quick Reservation Booked');
            });

        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error occured while booking reservation');
        }

        return Redirect::back()->with('success', 'Quick Reservation booked successfully');
    }


    public function reserveforpatient(Request $request)
    {

        // dd($request->all());

        $request->validate([
            'patientUID' => 'required',
            // 'date' => 'required',
            // 'hour' => 'required',
            'time' => 'required',
            'insurance_type' => 'required',
            'insurance_policy_number' => 'required',
            'online' => 'required',
        ]);

        $date = date('Y-m-d', strtotime($request->time));
        $hour = date('H:i', strtotime($request->time));

        $reservation = array(
            'employee_uid' => Auth::getUID(),
            'user_uid' => $request->patientUID,
            'date' => $date,
            'hour' => $hour,
            'insurance_type' => $request->insurance_type,
            'insurance_policy_number' => $request->insurance_policy_number,
            'is_online' => $request->online,
        );

        $check = $this->reservation_exists($reservation, Auth::getUID());

        // dd($check);

        if ($check) {
            return Redirect::back()->with('error', 'Reservation already exists for the selected date and time');
        }

        $reservation = Database::push('reservations', $reservation);

        $employee = Auth::getUserData();
        $patient = Auth::getUserData($request->patientUID);

        // Mail::to($employee['email'])->send(new ReservationBookedEmployee($reservation, $employee, $patient));

        // Mail::to($patient['email'])->send(new ReservationBookedPatient($reservation, $patient, $employee));

        return Redirect::back()->with('success', 'Reservation booked successfully');
    }


}
