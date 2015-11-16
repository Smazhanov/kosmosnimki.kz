<?php
/**
 * Created by PhpStorm.
 * User: a.zhakypov
 * Date: 11.11.2015
 * Time: 17:05
 */
function ephem2xyz($ephems,$t){
    define("w3",7.2921158553e-5);
    $e = strtok($ephems," ");
    for($i=0;$i<4;$i++) {
        $e = strtok(" ");
    }
    $e = floatval($e);
    $I = deg2rad(floatval(strtok(" ")));
    $raan = fmod(deg2rad(floatval(strtok(" ")))-w3*$t,2*pi());
    echo rad2deg($raan)."\n";
    $aofp = fmod(360+floatval(strtok(" ")),360);
    $ta = floatval(strtok(" "));
    $ra = floatval(strtok(" "));
    $alat = deg2rad(fmod($aofp+$ta,360));
    $r = $ra*(1-$e)/(1-$e*cos($ta));
    $cartcoor['x'] = $r*(cos($alat)*cos($raan)-sin($alat)*cos($I)*sin($raan));
    $cartcoor['y'] = $r*(cos($alat)*sin($raan)+sin($alat)*cos($I)*cos($raan));
    $cartcoor['z'] = $r*sin($alat)*sin($I);
    return $cartcoor;
}

function cart2geo($cart){
    define("a",6378.137);
    define("f",298.257223563);
    define("b",a*(1-1/f));
    define("e1",(2-1/f)/f);
    define("e2",a*a/b/b*e1);
    $D = sqrt($cart['x']*$cart['x']+$cart['y']*$cart['y']);
    $r = sqrt($cart['z']*$cart['z']+(1-e1)*($cart['x']*$cart['x']+$cart['y']*$cart['y']));
    $B = atan($cart['z']*($r*$r*$r+b*e2*$cart['z']*$cart['z'])/$D/($r*$r*$r-b*e1*(1-e1)*$D*$D)); //formula Bouringa
    $geo['lon'] = rad2deg(atan($cart['y']/$cart['x']));
    $geo['h'] = $D/cos($B)-a/sqrt(1-e1*sin($B)*sin($B));
    $geo['lat'] = rad2deg($B);
    return $geo;
}


$ephemf = fopen("./ephemerids/EPHEMORB_DZHR_20151104000000_20151111000000.asc","r");
//$time = "11:00:0";
$date = date_create("2015-11-04T11:00:00");
$time = date_format($date,"Y/m/d H:i:s");
echo $time."\n";
for($i=0;$i<3;$i++)
    fgets($ephemf);
do{
    $ephems=fgets($ephemf);
} while(strstr($ephems,$time)==0);
echo $ephems;
fclose($ephemf);

$time = date_timestamp_get($date);
date_time_set($date,12,5,13.6477);
date_date_set($date,2015,3,21);
$time-= date_timestamp_get($date);
echo $time."\n";
$cartcoor = ephem2xyz($ephems,$time);
print_r($cartcoor);
$geo=cart2geo($cartcoor);
print_r($geo);


?>