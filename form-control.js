/**
 * Created by IErshov on 12.12.2014.
 */
formControl={};
formControl.set=function(name, value, checkboxOnly) {
    //var scenarios = ['input-text', 'input-radio', 'select', 'input-checkbox'];
    var scenario = '';
    var found = false;

    if(!checkboxOnly) {
        var ptr = $('#' + name + '');
        if (ptr && ptr.size()) found = true;

        if (!found) {
            ptr = $('[name=' + name + ']');
            if (ptr && ptr.size()) found = true;
        }
    }
    if (!found) {
        ptr = $('input[type="checkbox"][value="'+name+'"]');
        console.log(ptr);
        if (ptr && ptr.size()){
            found = true;
            scenario='input-checkbox';
        }
    }

    if(scenario!='input-checkbox' && checkboxOnly) return false;

    if(found){
        if(!scenario) {
            var select = /select/i;
            var input = /input/i;
            var radio = /radio/i;
            var checkbox = /checkbox/i;
            var text = /text/i;

            var tag = $(ptr).get(0).tagName;
            var type = $(ptr).attr('type');
            if (select.test(tag)) {
                scenario = 'select';
            } else if (input.test(tag)) {
                scenario = 'input';
                if (radio.test(type)) {
                    scenario = 'input-radio';
                } else if (checkbox.test(type)) {
                    scenario = 'input-checkbox';
                } else if (type === undefined || text.test(type)) {
                    scenario = 'input-text';
                }
            }
        }

        switch(scenario){
            case 'input-text':
                ptr.val(value);
                return true;
                break;
            case 'input-radio':
                ptr.prop("checked", false);
                ptr.each(function(){
                    if($(this).val()==value){$(this).prop("checked", true);}
                });
                return true;
                break;
            case 'select':
                ptr.find("option").prop("selected", false);
                ptr.find('[value="'+value+'"]').prop("selected", true);
                //console.log('select');
                return true;
                break;
            case 'input-checkbox':
                if(value && value!='0') ptr.prop("checked", true);
                else ptr.prop("checked", false);
                return true;
                break;
            default:
                console.log('Scenario not found: '+scenario);
        }
    }
    return false;
};

formControl.check=function(arr){
    $('input[type="checkbox"]').prop("checked", false);
    for(key in arr){
        //console.log(arr[key]);
        this.set(arr[key],1,true);
    }
};


formControl.listen = function(){
    // hide all dependences
    $('[data-depends]').each(function(){
        var selector=$(this).data('depends');
        $(selector).hide();
    });

    $('select').on('change',function(){
        var dependences=$(this).find('[data-depends]');
        var size = dependences.size();
        //console.log(size);

        if(size) {
            dependences.each(function () {
                var selector = $(this).data('depends');
                var action = $(this).is(':selected');
                console.log('selector: '+selector);
                console.log('action: '+action);
                if(!action) {$(selector).fadeOut(300);}
                if(action) {$(selector).fadeIn(300);}
            });
        }
    });
};
