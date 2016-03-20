/*+***********************************************************************************
 * by haidang009
 *************************************************************************************/

Vtiger_Edit_Js("EmailMarketing_Edit_Js",{},{

	relatedFields : ['total_emails','sent','errors','emailmarketing_status'],

	registerDisableFields : function(){
		var form = this.getForm();

 		for (i=0;i<this.relatedFields.length;i++){
			var relatedField = form.find('[name="'+this.relatedFields[i]+'"]');
			if(relatedField.is("select")){
				relatedField.attr('disabled',true).trigger("liszt:updated");
			}else{
				relatedField.attr('disabled','disabled');
			}
		}
	},

	stylingTemplate : function(){
		var form = this.getForm();
		var Description = form.find('[name="template"]');
		var descriptionClosetTR = Description.closest("tr");
		descriptionClosetTR.find('[class="span10"]').css({"width":"100%"});
	},

	/*
	 * Function to register the send email template event
	 */
	registerSendEmailTemplateEvent : function(){
		var thisInstance = this;
		var form = this.getForm();
		var subjectElement = form.find('[name="subject"]');
		var templateElement = form.find('[name="template"]');

		jQuery('#selectEmailTemplate').on('click',function(e){
			var url = jQuery(e.currentTarget).data('url');

			var popupInstance = Vtiger_Popup_Js.getInstance();
			popupInstance.show(url,function(data){
				var responseData = JSON.parse(data);
				for(var id in responseData){
					var selectedName = responseData[id].name;
					var selectedTemplateBody = responseData[id].info;
				}

				subjectElement.val(selectedName);

				templateId = templateElement.attr('id');
				
				CKEDITOR.instances.EmailMarketing_editView_fieldName_template.setData(selectedTemplateBody, function(){
					this.checkDirty();
				});
			},'tempalteWindow');
		});
	},

	registerFormSubmit : function(){
		var form = this.getForm();
		var thisInstance = this;
		form.submit(function(e){
			for (i=0;i<thisInstance.relatedFields.length;i++){
				var relatedField = form.find('[name="'+thisInstance.relatedFields[i]+'"]');
				relatedField.removeAttr('disabled');
			}
		});
	},

	registerEvents : function(){
		var thisInstance = this;
		var form = thisInstance.getForm();
		this.registerDisableFields();
		this.registerFormSubmit();
		this.stylingTemplate();
		this.registerSendEmailTemplateEvent();
		this._super();

		// On Source change, update total emals
		form.find('[name="emailmarketing_source"]').on('change',function(){
			var sourceVal = jQuery(this).val();
			
			var params = {
				'module':app.getModuleName(),
				'action':'GetListData',
				'mode':'get_total_email',
				'record':form.find('[name="record"]').val(),
				'campaign_id':form.find('[name="campaign_id"]').val(),
				'source': sourceVal
			};
			AppConnector.request(params).then(function(data){
				form.find('[name="total_emails"]').val(data);
			});
		});
	}
});


