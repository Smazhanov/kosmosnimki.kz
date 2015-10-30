<?php 
		if(isset($_POST['top']) && isset($_POST['right']) && isset($_POST['bottom']) && isset($_POST['left']) && isset($_POST['allPeriod']))
		{
			$ch = curl_init();
			//      "7|0|14|http://cof2.gharysh.kz/customer-office/net.eads.astrium.faceo.HomePage/|F5D7A83DB22C52A50C21C05DB8965B9A|net.eads.astrium.faceo.middleware.gwt.client.ICatalogueGWTService|queryCatalogueSetRecords|net.eads.astrium.faceo.core.apis.catalogue.CatalogueSetRecordQuery/112575587|net.eads.astrium.faceo.core.apis.common.request.Criteria/4096422861|net.eads.astrium.faceo.core.apis.catalogue.CatalogueRecordQuery/3099495460|java.util.ArrayList/4159755760|net.eads.astrium.faceo.common.data.geographical.Box/1707532656|net.eads.astrium.faceo.common.data.geographical.GeoPosition/3149863295|EPSG:4326|net.eads.astrium.faceo.common.data.temporal.Period/2004917229|java.util.Date/3385151746|java.lang.Integer/3438268394|1|2|3|4|2|5|6|5|7|8|1|9|10|0|".$_POST['top']."|".$_POST['right']."|10|0|".$_POST['bottom']."|".$_POST['left']."|0|11|1|8|0|500|8|1|12|13|".$_POST['endDate']."|13|".$_POST['startDate']."|8|1|14|0|0|0|6|0|0|0|";
			$body = "7|0|12|http://cof2.gharysh.kz/customer-office/net.eads.astrium.faceo.HomePage/|F5D7A83DB22C52A50C21C05DB8965B9A|net.eads.astrium.faceo.middleware.gwt.client.ICatalogueGWTService|queryCatalogueSetRecords|net.eads.astrium.faceo.core.apis.catalogue.CatalogueSetRecordQuery/112575587|net.eads.astrium.faceo.core.apis.common.request.Criteria/4096422861|net.eads.astrium.faceo.core.apis.catalogue.CatalogueRecordQuery/3099495460|java.util.ArrayList/4159755760|net.eads.astrium.faceo.common.data.geographical.Box/1707532656|net.eads.astrium.faceo.common.data.geographical.GeoPosition/3149863295|EPSG:4326|java.lang.Integer/3438268394|1|2|3|4|2|5|6|5|7|8|1|9|10|0|".$_POST['top']."|".$_POST['right']."|10|0|".$_POST['bottom']."|".$_POST['left']."|0|11|1|8|0|500|8|0|8|1|12|0|0|0|6|0|0|0|";
			curl_setopt($ch, CURLOPT_URL,            "http://cof2.gharysh.kz/customer-office/net.eads.astrium.faceo.HomePage/catalogueService.rpc" );
			// curl_setopt($ch, CURLOPT_URL,            "http://quickjson.com/generate/627604aecc6d" );
			// curl_setopt ($ch, CURLOPT_PORT , 81);
			// curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4 );
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 );
			curl_setopt($ch, CURLOPT_POST,           1 );
			curl_setopt($ch, CURLOPT_POSTFIELDS,     $body ); 
			curl_setopt($ch, CURLOPT_HTTPHEADER,     array('Content-Type: text/x-gwt-rpc; charset=UTF-8')); 
			$result=curl_exec ($ch);
			echo $result;
			if($result === false)
			{
			    echo 'Ошибка curl: ' . curl_error($ch);
			}
			// phpinfo();
			curl_close($ch);
		}
 ?>