/**
 * Created by IErshov on 12.12.2014.
 */

var synonym={size:0, revert:{}};
synonym.refresh = function(){
    this.revert={};
    this.size=0;
    for(var key in this.map) {
        // key - название свойства
        // object[key] - значение свойства
        this.revert[this.map[key]]=key;
        this.size++;
    }
    return true;
};

synonym.map ={
    surname 	:	'secondname',
    name		:	'name',
    patronymic	:	'patronymic',
    birth_day	:	'birth_day',
    birth_month	:	'birth_month',
    birth_year	:	'birth_year',
    gender	    :	'gender',
    learning_team:	'studgroup',
    branch	    :	'affiliate',
    phone	    :	'phone',
    email	    :	'email',
    fio_mother	:	'mother_fullname',
    mother_phone:	'mother_phone',
    fio_father	:	'father_fullname',
    father_phone:	'father_phone',
    vk_id	    :	'vkcomID',
    interests	:	'interests'
};

/* Usage
Object for asign html form IDs with database fields
1) Fill the map
2) call: synonym.refresh();
3) Ask revert field name: var synonym_field = synonym.revert[field];
 */
