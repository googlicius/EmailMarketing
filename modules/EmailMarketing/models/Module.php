<?php
/**
 * by haidang009
 */
 
 class EmailMarketing_Module_Model extends Vtiger_Module_Model{
	
	/**
	 * Function to check whether the module is summary view supported
	 * @return <Boolean> - true/false
	 */
	public function isSummaryViewSupported() {
		return false;
	}
 }