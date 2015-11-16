<?php
/**
 * Created by PhpStorm.
 * User: a.zhakypov
 * Date: 11.11.2015
 * Time: 17:05
 */
define("a",6378.137);
define("f",298.257223563);
define("b",a*(1-1/f));
define("e1",(2-1/f)/f);
define("e2",a*a/b/b*e1);

function ephem2xyz($ephems,$t,&$I){
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
    $D = sqrt($cart['x']*$cart['x']+$cart['y']*$cart['y']);
    $r = sqrt($cart['z']*$cart['z']+(1-e1)*($cart['x']*$cart['x']+$cart['y']*$cart['y']));
    $B = atan($cart['z']*($r*$r*$r+b*e2*$cart['z']*$cart['z'])/$D/($r*$r*$r-b*e1*(1-e1)*$D*$D)); //formula Bouringa
    $geo['lon'] = rad2deg(atan($cart['y']/$cart['x']));
    $geo['h'] = $D/cos($B)-a/sqrt(1-e1*sin($B)*sin($B));
    $geo['lat'] = rad2deg($B);
    return $geo;
}

function angDist($a,$b){
    $phi[0] = deg2rad($a['lat']);
    $phi[1] = deg2rad($b['lat']);
    $lam = deg2rad($b['lon']-$a['lon']);
    $aD = acos(sin($phi[0])*sin($phi[1])+cos($phi[0])*cos($phi[1])*cos($lam));
    echo "AD = ".rad2deg($aD)."\n";
    return $aD;
}

function angAng($a,$b){
    $phi = deg2rad($b['lat']-$a['lat']);
    $lam = deg2rad($b['lon']-$a['lon']);
    $aA = atan(sin($phi)/sin($lam));
    echo "AA = ".rad2deg($aA)."\n";
    return $aA;
}

function acb($a,$b,$j){
    $ab = sin(angDist($a,$b));
    $cab = angAng($a,$b)+$j;
    $gamma['roll'] = asin($ab*cos($cab));
    $gamma['pitch'] = asin($ab*sin($cab));
    print_r($gamma);
    return $gamma;
}

function rA($B,$A){
    $N = a/sqrt(1-e1*sin($B)*sin($B));
    $rA = $N/(1+e2*cos($B)*cos($B)*sin($A)*sin($A));
    echo "rA = ".$rA."\n";
    return $rA;
}

function finAng($r,$g,$H){
    $alpha = atan($r*sin($g)/($H+$r*(1-cos($g))));
    return rad2deg($alpha);
}

$ephemf = fopen("./ephemerids/EPHEMORB_DZHR_20151104000000_20151111000000.asc","r");
//$time = "11:00:0";
$date = date_create("2015-11-04T11:00:00");
$time = date_format($date,"Y/m/d H:i:s");
$qlook['lat'] = 68;
$qlook['lon'] = 20;
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
$cartcoor = ephem2xyz($ephems,$time,$I);
print_r($cartcoor);
$geo=cart2geo($cartcoor);
print_r($geo);
$gamma = acb($geo,$qlook,$I-pi()/2);
$r['roll'] = rA($geo['lat'],$I);
$r['pitch'] = rA($geo['lat'],$I+pi()/2);
$angOfShot['roll'] = finAng($r['roll'],$gamma['roll'],$geo['h']);
$angOfShot['pitch'] = -finAng($r['pitch'],$gamma['pitch'],$geo['h']);
print_r($angOfShot);
?>