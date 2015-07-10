/**
 * Created by IErshov on 11.12.2014.
 */
var docState={data:{},changes:false,debug:false,flagReset:false};
var apicontrol={};

docState.check = function(){
    if(supports_html5_storage()){
        docState.storageStatus='OK';
    }else{
        docState.storageStatus='fail';
    }

    if(localStorage['docStateData']===undefined) {console.log('data empty');}
    else {this.load();}
};

docState.save = function(){
    if(this.debug) console.log('docState.save start');
    if(this.flagReset===true)
    {
        this.flagReset=false;
        return false;
    }
    if(this.flagLock) return false;
    // Скрипт маски номера телефона вызывает событие change на поле с номером телефона
    if(docState.data.phone=="") delete docState.data.phone;
    if($.isEmptyObject(docState.data)) return false;

    if(this.debug) console.log(this.data);
    var str=JSON.stringify(this.data);
    if(this.debug) console.log(str);
    localStorage['docStateData']=str;
    this.changes=true;
    if(this.debug) console.log('docState.save done');
};

docState.load = function(){
    this.flagLock=true;
    var json=localStorage['docStateData'];
    var obj=JSON.parse(localStorage['docStateData']);
    this.data = obj;
    if(this.debug) console.log('Load done');
    if(this.debug) console.log(this.data);
    // TODO: Заполнение всех полей
    var dat=this.data;
    formControl.check(this.data.interests);
    delete dat.interests;
    for(key in dat){
        //console.log(key+'>>'+dat[key]);
        formControl.set(synonym.revert[key], dat[key]);
    }

    this.flagLock=false;
};

docState.reset = function(){
    if(this.debug) console.log('Reset:');
    this.flagReset=true;
    console.log(this);
    localStorage.removeItem('docStateData');
    $('input').val('');
    $("select option").prop("selected", false);
    $('input[type="checkbox"]').prop("checked", false);
    docState.changes=false;
    delete docState.data;
    docState.data={};
    if(this.debug) console.log('Reset done');
};

apicontrol.create=function(data){
    var url = "http://crm.syndev.ru/api/v1/student/create/";
    var success = function (response){
        console.log(response);
        docState.data.id=response.id;
        docState.data.verify=response.verify;
        apicontrol.checkResponse(response);
    };

    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        data: data,
        success: success
    });
};

apicontrol.check=function(data){
    var url = "http://crm.syndev.ru/api/v1/student/check/";
    var success = function (response){ console.log(response); apicontrol.checkResponse(response); };

    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        data: data,
        success: success
    });
};

apicontrol.update=function(data){
    var url = "http://crm.syndev.ru/api/v1/student/update/";
    var success = function (response){ console.log(response);  apicontrol.checkResponse(response);};

    $.ajax({
        type: "POST",
        dataType: "json",
        url: url,
        data: data,
        success: success
    });
};

apicontrol.checkChanges=function(){
    if(docState.debug) console.log('tick');
    if(docState.changes){
        if(docState.debug) console.log('changes found');
        var result=0;
        // Отправка данных в API
        if(docState.data.id===undefined || docState.data.verify===undefined)
        {
            apicontrol.create(docState.data);
        }else{
            apicontrol.update(docState.data);
        }
        docState.changes=false;
        return true;
    }
    return false;
};

apicontrol.start=function(){
    console.log('apicontrol check changes start...');
    setInterval(apicontrol.checkChanges, 500);
    /**/
};

function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

apicontrol.checkResponse=function(response) {
    if(response.status=='fail'){
        console.log('Response: "failed"');
        if(response.message=='Wrong verify') {
            console.log('Сброс формы');
            docState.reset();
        }
    }
};