<?php
	if (isset($_POST['qlUrl']) && isset($_POST['name'])){
		$filename = $_POST['qlUrl'];
		$pathname = "./images/". $_POST['name'] .".png";
		$degrees = 25;
		
		$source = imagecreatefrompng($filename);
		
		$pngTransparency = imagecolorallocatealpha($source , 0, 0, 0, 127);
		imagefill($source , 0, 0, $pngTransparency);
		$rotate = imagerotate($source, $degrees, $pngTransparency, 1);
		imagealphablending( $rotate, false );
		imagesavealpha( $rotate, true );
		header('Content-Type: image/png');
		imagepng($rotate, $pathname);
		$data = array();
		$data[0] = $pathname;
		$data[1] = $_POST['north'];
		$data[2] = $_POST['south'];
		$data[3] = $_POST['east'];
		$data[4] = $_POST['west'];
		header('Content-Type: application/json');
		echo json_encode($data);
		imagedestroy($source);
		imagedestroy($rotate);
	}
?>