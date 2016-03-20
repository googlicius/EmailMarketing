
// by haidang009

Vtiger_Detail_Js("EmailMarketing_Detail_Js",{
	dynamicInstance : false,
	loadmore_limit : 0,

	triggerLoadMore : function(e){
		var thisInstance = this;
		if(jQuery(e).attr('disabled') == 'disabled') return;
		thisInstance.disabledElement(jQuery(e));
		
		params = {
			record:jQuery("#recordId").val(),
			module:app.getModuleName(),
			view:'LoadMore',
			offset: jQuery(e).data('offset'),
			limit: jQuery(e).data('limit')
		};
		
		AppConnector.request(params).then(function(result){
			//Calculate new Offset
			jQuery('.EmailMarketingTalble tbody tr:last').after(result);
			old_offset = jQuery("#load_more_btn").data('offset');			
			new_offset = parseInt(old_offset) + parseInt(thisInstance.loadmore_limit);
			jQuery("#load_more_btn").data('offset',new_offset);

			thisInstance.enableElement(jQuery(e));

			// Hide Load More btn if end of row
			if(parseInt(jQuery(result).length/2)+1 < parseInt(thisInstance.loadmore_limit))
				jQuery("#load_more_btn").addClass('hide');
		},function(error,err){

		});
	},

	disabledElement : function(je){
		je.attr('disabled','disabled');
	},
	enableElement : function(je){
		je.removeAttr('disabled');
	},
	/**
	 * by haidang009 Function to get variable in url
	 * @return : object - varialble of GET
	 */
	 getUrlVars : function() {
	 	var vars = {};
	 	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	 		vars[key] = value;
	 	});
	 	return vars;
	 },
},{

	sendEmailInterval : false,
	continueSendingInterval : false,
	pendingRequestCount : 0,

	init : function (){
		EmailMarketing_Detail_Js.dynamicInstance = this;
	},

	registerLoadMoreLimitChange : function(){
		var form = this.getForm();
		var loadMoreLimitElement = form.find('[name="limit_loadmore"]');

		if(loadMoreLimitElement.val() != null){
			EmailMarketing_Detail_Js.loadmore_limit = loadMoreLimitElement.val();
		}else{
			EmailMarketing_Detail_Js.loadmore_limit = 50;
		}

		loadMoreLimitElement.on('change',function(){
			EmailMarketing_Detail_Js.loadmore_limit = loadMoreLimitElement.val();
			jQuery("#load_more_btn").data('limit',loadMoreLimitElement.val());
		});
	},

	registerDisableFields : function(){
		var form = this.getForm();
		var relatedFields = ['template','total_emails','sent','errors','emailmarketing_source','emailmarketing_status'];
		for (i=0;i<relatedFields.length;i++){
			var relatedField = form.find('[name="'+relatedFields[i]+'"]');
			if(relatedField.is("select")){
				relatedField.attr('disabled',true).trigger("liszt:updated");
			}else{
				relatedField.attr('disabled','disabled');
			}
		}
	},

	sendRequest : function (data,functionCallback,datatype){
		datatype = ( datatype == '' || typeof(datatype) == 'undefined' ) ? 'html' : datatype;
		var url = "index.php";
		var thisInstance = this;
		thisInstance.pendingRequestCount++;

		$.ajax({
			url : url,
			type: "post",
			data: data,
			datatype: datatype,
			success : function (result){
				thisInstance.pendingRequestCount--;
				if(typeof functionCallback === 'function') functionCallback(data,result);
			},
			error: function (err){
				thisInstance.pendingRequestCount--;
				console.log(err);
			}
		});
	},

	registerLoadEmailList : function(functionCallback){
		var record = jQuery("#recordId");
		var url = EmailMarketing_Detail_Js.getUrlVars();

		var page = ( typeof url.page == 'undefined' ) ? 1 : url.page;
		var offset = parseInt(page) * parseInt(EmailMarketing_Detail_Js.loadmore_limit) - parseInt(EmailMarketing_Detail_Js.loadmore_limit);

		params = {record:record.val(),module:app.getModuleName(),view:'EmailList',limit: EmailMarketing_Detail_Js.loadmore_limit,offset: offset};

		this.sendRequest(params, function(params,result){
			jQuery("#email_list_holder").html(result);
			var EmailMarketingTalbleWidth = jQuery(".EmailMarketingTalble").width();
			jQuery(".topscroll-div").width(EmailMarketingTalbleWidth);

			//function call after this function is done
			if(typeof functionCallback === 'function') functionCallback();
		},'html');
	},

	changeStatusToSending : function(sendButton){
		var form = this.getForm();
		this.stopTimer(jQuery('.timer'));
		sendButton.attr("disabled","disabled");
		var params = {
			'value' : 'EMAILMARKETING_SENDING',
			'field' : 'emailmarketing_status',
			'record' : jQuery("#recordId").val(),
			'module' : app.getModuleName(),
			'action' : 'SaveAjax'
		}
		var pnotify_params = {text: app.vtranslate('Status changed to sending'),type:'info'};
		this.sendRequest(params,function(params,result){
			Vtiger_Helper_Js.showPnotify(pnotify_params);
			sendButton.html(app.vtranslate("Sending..."));
			jQuery("#stop_send").removeClass("hide");
			form.find('[name="emailmarketing_status"]').val('EMAILMARKETING_SENDING');
			var currentTdElement = jQuery("#"+app.getModuleName()+"_detailView_fieldValue_emailmarketing_status");
			var detailViewValue = jQuery('.value',currentTdElement);
			detailViewValue.html(result.result.emailmarketing_status.display_value);
			jQuery("#"+app.getModuleName()+"_detailView_basicAction_LBL_EDIT").attr('disabled','disabled');
		},'jsonp');
	},

	changeStatusToDone : function(sendButton){
		var form = this.getForm();
		var params = {
			'value' : 'EMAILMARKETING_DONE',
			'field' : 'emailmarketing_status',
			'record' : jQuery("#recordId").val(),
			'module' : app.getModuleName(),
			'action' : 'SaveAjax'
		}
		var pnotify_params = {text: app.vtranslate('Status changed to done')+"!",type:'info'};
		this.sendRequest(params,function(params,result){
			sendButton.removeAttr("disabled").html(app.vtranslate("Send Email to this list"));
			jQuery("#stop_send").addClass("hide");
			jQuery("#"+app.getModuleName()+"_detailView_basicAction_LBL_EDIT").removeAttr('disabled');
			form.find('[name="emailmarketing_status"]').val('EMAILMARKETING_DONE');
			var currentTdElement = jQuery("#"+app.getModuleName()+"_detailView_fieldValue_emailmarketing_status");
			var detailViewValue = jQuery('.value',currentTdElement);
			detailViewValue.html(result.result.emailmarketing_status.display_value);
			Vtiger_Helper_Js.showPnotify(pnotify_params);
			alert(app.vtranslate('All emails have been sent!'));
		},'jsonp');
	},

	continueSendEmailAfterPageLoad : function(){
		var form = this.getForm();
		var thisInstance = this;
		//if Status is Sending then continue send remain emails in the list
		if(form.find('[name="emailmarketing_status"]').val() == 'EMAILMARKETING_SENDING'){
			jQuery("#stop_send").removeClass("hide");
			var display = jQuery(".timer");
			this.startTimer(17,display,function(){
				thisInstance.emailSendingHandler();
			});
		}
	},

	/**
	 * Countdown function  
	 * @param: duration <seconds> - duration of timer
	 * @param: display - <text> - place the timer in DOM
	 */
	 startTimer : function(duration, display, functionCallback) {
	 	var timer = duration, minutes, seconds;
	 	var thisInstance = this;
	 	this.continueSendingInterval = setInterval(function () {
	 		minutes = parseInt(timer / 60, 10);
	 		seconds = parseInt(timer % 60, 10);

	 		minutes = minutes < 10 ? "0" + minutes : minutes;
	 		seconds = seconds < 10 ? "0" + seconds : seconds;

			//display.html(minutes + ":" + seconds);
			display.html(app.vtranslate("Continue sending in")+ " " + seconds + " " + app.vtranslate("seconds")).effect('highlight',1000);

			if (--timer < 0) {
				thisInstance.stopTimer(display);
				functionCallback();
			}
		}, 1000);
	 },

	 stopTimer : function(display){
	 	display.html('');
	 	clearInterval(this.continueSendingInterval);
	 },

	 emailSendingHandler : function(){
	 	var thisInstance = this;
	 	var pnotify_params = {text: 'Email sent',type:'info'}
	 	var form = this.getForm();
	 	var sendButton = jQuery("#send_email_btn");
	 	var emailMarketingTalble = jQuery(".EmailMarketingTalble");

	 	thisInstance.changeStatusToSending(sendButton);

	 	var request_params = {
	 		module:app.getModuleName(),
	 		action:'SendEmail',
	 		mode:'update_current_parent'
	 	}

	 	var promise = thisInstance.emailInformationsNotMappingCRM();

	 	promise.then(function(data){
	 		var i=0;
	 		var data_length = data.length;

	 		if(data_length == 0){
	 			thisInstance.changeStatusToDone(sendButton);
	 			return;
	 		}

	 		var numberOfRequestPendingAllow = 2;
	 		thisInstance.sendEmailInterval = setInterval(function(){

				// Max request pending allow is numberOfRequestPendingAllow
				if(thisInstance.pendingRequestCount < numberOfRequestPendingAllow){
					data[i].subject = form.find('[name="subject"]').val();
					data[i].description = form.find('[name="template"]').val();
					var curent_data = data[i];
					// Send to Email MassAjaxView
					thisInstance.sendRequest(data[i],function(curent_data,result){

						var positionFound = result.search("Vtiger_Detail_Js");

						request_params.email_status = (positionFound != -1) ? 1 : -1;
						request_params.parentid = curent_data.parentid;
						request_params.email = curent_data.toEmail;

						thisInstance.updateNumberEmailsSent(curent_data.email_status);
						var parent_row = emailMarketingTalble.find('[data-parentid="'+curent_data.parentid+'"]');
						if(positionFound != -1){
							pnotify_params.text = "Email sent: "+curent_data.toEmail;
							parent_row.css({"border-left":"10px solid #4c61c9"}).effect('highlight',{},2000);
						}else{
							pnotify_params.text = "Send error: "+curent_data.toEmail;
							pnotify_params.type = "warning";
							parent_row.css({"border-left":"10px solid red"}).effect('highlight',{},2000);
						}
						
						Vtiger_Helper_Js.showPnotify(pnotify_params);
					});


					i++;

					if(i>=data_length) {
						clearInterval(thisInstance.sendEmailInterval);
						thisInstance.changeStatusToDone(sendButton);
					}
				}
			},1000);
		});
	},

	updateNumberEmailsSent : function(email_status){
		var thisInstance = this;
		var form = thisInstance.getForm();
		if ( email_status != -1) {
			var params = {
				'sent' : parseInt(form.find('[name="sent"]').val())+1
			}
		}else{
			var params = {
				'errors' : parseInt(form.find('[name="errors"]')).val()+1
			}
		}

		thisInstance.updateDetailField(params);
	},

	updateDetailField : function(result){
		var form = this.getForm();
		var arr = [];
		jQuery.each(result,function(i,v){
			arr.push({key:i,value:v});
		});

		form.find('[name="'+arr[0].key+'"]').val(arr[0].value);
		var currentTdElement = jQuery("#"+app.getModuleName()+"_detailView_fieldValue_"+arr[0].key);
		var detailViewValue = jQuery('.value',currentTdElement);
		detailViewValue.html(arr[0].value);
	},

	registerSendEmailByClick : function(){
		var sendButton = jQuery("#send_email_btn");
		var thisInstance = this;
		var form = this.getForm();
		sendButton.on('click',function(){
			if(sendButton.attr('disabled')) return;
			thisInstance.emailSendingHandler();
		});

		jQuery("#stop_send").on('click',function(){
			clearInterval(thisInstance.sendEmailInterval);
			if(thisInstance.continueSendingInterval){
				thisInstance.stopTimer(jQuery(".timer"));
			}
			var params = {
				'value' : 'EMAILMARKETING_CANCELED',
				'field' : 'emailmarketing_status',
				'record' : jQuery("#recordId").val(),
				'module' : app.getModuleName(),
				'action' : 'SaveAjax'
			}
			var pnotify_params = {text: app.vtranslate('Sending canceled!')+"!",type:'info'};
			thisInstance.sendRequest(params,function(params,result){
				sendButton.removeAttr("disabled").html(app.vtranslate("Send Email to this list"));
				jQuery("#stop_send").addClass("hide");
				jQuery("#"+app.getModuleName()+"_detailView_basicAction_LBL_EDIT").removeAttr('disabled');
				form.find('[name="emailmarketing_status"]').val('EMAILMARKETING_CANCELED');
				var currentTdElement = jQuery("#"+app.getModuleName()+"_detailView_fieldValue_emailmarketing_status");
				var detailViewValue = jQuery('.value',currentTdElement);
				detailViewValue.html(result.result.emailmarketing_status.display_value);
				Vtiger_Helper_Js.showPnotify(pnotify_params);
			},'jsonp');
		});
	},

	emailInformationsNotMappingCRM : function(){
		var deferred = jQuery.Deferred();
		var recordId = jQuery("#recordId").val();
		var params = {module:app.getModuleName(),action:'SendEmail',mode:'getListEmailNotSent',record:recordId}
		var thisInstance = this;
		this.sendRequest(params,function(params,result){
			var arr_result = new Array();
			if(result !== 'null'){
				var parsed = JSON.parse(result);
				jQuery.each(parsed,function(i,v){				
					var info = thisInstance.emailInformationsMappingCRM(v);
					arr_result.push(info);
				});
			}
			deferred.resolve(arr_result);
		},'jsonp');
		return deferred.promise();
	},

	// Get request information for sending email mapping with Leads, Contacts or Accounts
	emailInformationsMappingCRM : function(params){
		var info = {
			'selected_ids' : '["'+params.parentid+'"]',
			'excluded_ids' : '""',
			'viewname' : '',
			'module' : 'Emails',
			'selectedFields' : '["email"]',
			'mode' : 'massSave',
			'toemailinfo' : '{"'+params.parentid+'":["'+params.email+'"]}',
			'view' : 'MassSaveAjax',
			'to' : '["'+params.email+'"]',
			'toMailNamesList' : '{"'+params.parentid+'":[{"label":"'+params.label+'","value":"'+params.email+'"}]}',
			'flag' : 'SENT',
			'documentids' : '',
			'emailMode' : '',
			'search_key' : '',
			'operator' : '',
			'search_value' : '',
			'search_params' : '"null"',
			'toEmail' : params.email,
			'cc' : '',
			'bcc' : '',
			'related_load' : '1',
			'attachments' : 'null',
			'parent_id'  : params.parentid+'@1|',
			'parentid'  : params.parentid,
			'emailmarketingid'  : jQuery("#recordId").val(),
			'send_from_emailmarketing'  : 'true',
			'campaign_id'  : params.campaign_id,
		}
		return info;
	},

	registerEventsAfterPageLoad : function(){
		var thisInstance = this;
		var form = thisInstance.getForm();
		this.registerDisableFields();
		var url = EmailMarketing_Detail_Js.getUrlVars();

		var page = ( typeof url.page == 'undefined' ) ? 1 : url.page;
		this.loadPagingBar(page);
		this.registerLoadEmailList(function(){
			thisInstance.registerListViewEntriesClick();
			thisInstance.registerSearchEvent();
			thisInstance.registerSortByClickEvent();
			thisInstance.continueSendEmailAfterPageLoad();
			jQuery("#load_more_btn")
				.data('limit',EmailMarketing_Detail_Js.loadmore_limit)
				.data('offset',EmailMarketing_Detail_Js.loadmore_limit)
				.removeClass('hide');
		});
	},

	loadPagingBar : function(page){
		var thisInstance = this;
		var params = {
			module : app.getModuleName(),
			record : jQuery("#recordId").val(),
			page : page,
			view : 'Paging',
			limit : EmailMarketing_Detail_Js.loadmore_limit
		};

		// Load pages
		this.sendRequest(params,function(params,result){
			jQuery("#pagingHolder").html(result);
			thisInstance.registerPageNavigationEvents();
		});
	},

	loadPagingList : function(page,orderby){
		var thisInstance = this;
		var url = EmailMarketing_Detail_Js.getUrlVars();
		var offset = parseInt(page) * parseInt(EmailMarketing_Detail_Js.loadmore_limit) - parseInt(EmailMarketing_Detail_Js.loadmore_limit);
		var params = {
			record:jQuery("#recordId").val(),
			module:app.getModuleName(),
			view:'LoadMore',
			offset: offset,
			limit: EmailMarketing_Detail_Js.loadmore_limit
		};

		search_form = jQuery("#search_form").serializeArray();
		for(var key in search_form){
			if(search_form[key].value){
				params['search_string'] = search_form;
				break;
			}
		}

		if(typeof orderby !== 'undefined'){
			params['orderby'] = orderby;
		}


		this.sendRequest(params,function(params,result){
			thisInstance.registerListViewEntriesClick();
			jQuery(".EmailMarketingTalble tbody tr.parent_row").remove();
			jQuery(".EmailMarketingTalble tbody tr:last").after(result);
		});
	},

	registerListViewEntriesClick : function(){
		jQuery("body").on('click','.listViewEntries',function(e){
			var curTd = jQuery(e.target);
			curTr = curTd.closest('tr');
			window.location.href = "index.php?module="+curTr.data('parentname')+"&view=Detail&record="+curTr.data('parentid');
		});
	},

	registerPageNavigationEvents : function(){
		var thisInstance = this;

		jQuery('#listViewNextPageButton').on('click',function(){
			//alert(1);
		});
		jQuery('.paging-anchor').on('click',function(e){
			if(jQuery(this).attr('disabled') == 'disabled') return false;

			page = jQuery(this).data('page');
			jQuery(this).addClass('btn-warning');
			thisInstance.loadPagingBar(page);
			thisInstance.loadPagingList(page);
			var pageurl = jQuery(this).attr('href');
			if(pageurl!=window.location){
				window.history.pushState({path:pageurl},'',pageurl);
			}
			e.preventDefault();
		});
		jQuery('#listViewPageJump').on('click',function(e){
			//alert(3);
		});
	},

	registerSearchEvent : function(){
		var thisInstance = this;
		jQuery('body').on('submit','#search_form',function(){
			thisInstance.loadPagingList(1);
			return false;
		});
	},

	registerSortByClickEvent : function(){
		var thisInstance = this;
		jQuery(".sort_by_click").on('click',function(){
			var orderby_name = jQuery(this).data('name');
			var trHead = jQuery(this).closest('tr');
			trHead.find('img').remove();
			if ( jQuery(this).data('orderby') == 'ASC' ){
				var orderby_value = 'DESC';
				jQuery(this).append(' <img class="icon-chevron-down">');

			}else{
				var orderby_value = 'ASC';				
				jQuery(this).append(' <img class="icon-chevron-up">');
			}

			var orderby = {};
			orderby['name'] = orderby_name;
			orderby['value'] = orderby_value;

			thisInstance.loadPagingList(1,orderby);

			jQuery(this).data('orderby',orderby_value);
		});
	},

	registerOpenCheckDuplicateModal : function(){
		var thisInstance = this;
		jQuery("#chk_dup_btn").on('click',function(){
			var params = {
				module: app.getModuleName(),
				view: 'DuplicateEmailModal',
				record: jQuery("#recordId").val(),
			};

			var callBackFunction = function(data){
				app.showScrollBar(jQuery(data).find('.modal-body'),{'height':'500px'});
				//instance.registerCallCenterCampaignFormSubmit();
			};

			var loadingMessage = app.vtranslate('Đang tải...');
			var progressIndicatorElement = jQuery.progressIndicator({
				'message' : loadingMessage,
				'position' : 'html',
				'blockInfo' : {
					'enabled' : true
				}
			});

			AppConnector.request(params).then(function(result){
				if(result) {
					progressIndicatorElement.progressIndicator({
						'mode' : 'hide'
					});

					app.showModalWindow(result, function(result){
						if(typeof callBackFunction == 'function'){
							callBackFunction(result);
						}
					},{
						'text-align' : 'left'
					});
				}
			},function(error,err){});
		});
	},

	iniDuplateModalForm : function(){

	},

	registerEvents : function(){
		this._super();
		this.registerLoadMoreLimitChange();
		this.registerEventsAfterPageLoad();
		this.registerSendEmailByClick();
		this.registerOpenCheckDuplicateModal();
	}
});

jQuery(window).on('popstate',function(event) {
    url = EmailMarketing_Detail_Js.getUrlVars();
    
    if(url.module == app.getModuleName()){
    	if(url.page)
    		jQuery("#page_"+url.page).trigger('click');
    	else
    		jQuery("#page_1").trigger('click');
    }
});