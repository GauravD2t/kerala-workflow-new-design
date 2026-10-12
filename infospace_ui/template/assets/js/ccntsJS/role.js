'use strict';
// Class definition
var datatable=null
var selectedList=[];  
var dualListBox =null 
var KTDatatableDataLocalDemo = function () {  
    var initDualListbox = function() {        
        var listBoxes = $("#menulist");            
        listBoxes.each(function() {
            var $this = $(this);
            // get titles
            var availableTitle = ($this.attr('data-available-title') != null) ? $this.attr('data-available-title') : 'Available options';
            var selectedTitle = ($this.attr('data-selected-title') != null) ? $this.attr('data-selected-title') : 'Selected options';      
            // get button labels
            var addLabel = ($this.attr('data-add') != null) ? $this.attr('data-add') : 'Add';
            var removeLabel = ($this.attr('data-remove') != null) ? $this.attr('data-remove') : 'Remove';
            var addAllLabel = ($this.attr('data-add-all') != null) ? $this.attr('data-add-all') : 'Add All';
            var removeAllLabel = ($this.attr('data-remove-all') != null) ? $this.attr('data-remove-all') : 'Remove All';      
            
            // get options
            var options = [];
            $this.children('option').each(function() {
              var value = $(this).val();
              var label = $(this).text();
              var selected = !!($(this).is(':selected'));
              options.push({text: label, value: value, selected: false});
            });      
            // get search option
            var search = ($this.attr('data-search') != null) ? $this.attr('data-search') : '';      
            // clear duplicates
            $this.empty();      
            // init dual listbox
             dualListBox = new DualListbox($this.get(0), {
              addEvent: function(value) {
                selectedList.push(value)   
                console.log(selectedList)             
              },
              removeEvent: function(value) {                
                var index = selectedList.indexOf(value);
                selectedList.splice(index, 1);                
                console.log(selectedList)             
              },
              availableTitle: availableTitle,
              selectedTitle: selectedTitle,
              addButtonText: addLabel,
              removeButtonText: removeLabel,
              addAllButtonText: addAllLabel,
              removeAllButtonText: removeAllLabel,
              options: options,
              moveOnSelect:true
            });      
            if (search == 'false') {
              dualListBox.search.classList.add('dual-listbox__search--hidden');
              $(dualListBox.search).attr("placeholder","Search Menu")
            }
          });
    }; 
    
    var _init = function () {              
        $('#policestation').on('change', function () {
            var policestation={ps_cd:$(this).find(":selected").attr("ps_cd"),district:$(this).find(":selected").attr("district"),state:$(this).find(":selected").attr("state")}
            $("#pscd").val(policestation.ps_cd)
            $("#district").val(policestation.district)
            $("#state").val(policestation.state)            
        })        
        KTDatatableDataLocalDemo._initDualListbox();
        $('#kt_datatable_search_status, #kt_datatable_search_type').selectpicker();
        $(Document).on("change", "#role", function (event) {
            var id=$(this).val();
            KTDatatableDataLocalDemo.pushtoSrever(null, "/roles/"+id, "GET", function (node) {
                if(node.role.menus != undefined){
                    selectedList=[]
                    for(var i=0;i<dualListBox.options.length;i++){
                        dualListBox.options[i].selected=false
                        
                    }
                    for(var i=0;i<node.role.menus.length;i++){
                        var menu=node.role.menus[i];                        
                        var __FOUND = dualListBox.options.find(function(post, index) {
                            if(post.value === ""+menu.id){
                                console.log("menu::"+menu.menuname)
                                selectedList.push(""+menu.id)
                                dualListBox.options[index].selected=true
                                return index;
                            }
                            
                        });
                    }
                    dualListBox.selected = [];
                    dualListBox.available = [];
                    dualListBox._splitOptions(dualListBox.options);
                    dualListBox.redraw();
                }                
            });
        })
        $('.savebtn').on('click', function () {
            let menuGroup={role:$("#role").val(),menus:selectedList}
            KTDatatableDataLocalDemo.pushtoSrever(menuGroup, "saveRole.dwf", "POST", function (node) {               
                $("#role").val("-1")
                toastr.success(" Role update successfully.")
            })
        });
        $(Document).on("keypress", ".groubtxt", function (event) {
            console.log(event.keyCode)
            if(event.keyCode== 13){
                if($(this).val().trim().length !=0){
                    $(this).parent().html($(this).val())
                }else{
                    return false;
                }                
            }

        })
        $(Document).on("click", ".editbtn", function () {
            var id=$(this).attr("value");
            var value=$(this).parent().parent().parent().find(".Groupname").html();
            $(this).parent().parent().parent().find(".Groupname").html("<input class='groubtxt' type='text' value='"+value+"'/>")

        }) 
        $(Document).on("click", ".deletebtn", function () {
            var id=$(this).attr("value")
            KTDatatableDataLocalDemo.pushtoSrever(null, "/menugroups/"+id, "DELETE", function (node) {
                datatable.destroy();
                KTDatatableDataLocalDemo._rendareTable(node.data);
             });
        })      
        
    };

    return {       
       
        init: function (data) {   
            _init();         
            //rendareTable(data);
        },
        _initDualListbox: function(){
            initDualListbox();
        },           
        pushtoSrever: function (pushObject, url, method, callback) {
            $.ajax({
                async: false,
                type: method,
                dataType: 'json',
                url: url,
                data: pushObject,
                success: function (response) {
                    //toastr.success('Data InserteId Successfully!');                
                    callback(response);
                },
                error: function (response) {
                    //toastr.error('Problem in Deleting Data!');
                    console.log("error")
                    callback(response)
                }
            });
        }
    };
}();
jQuery(document).ready(function () {
    KTDatatableDataLocalDemo.init()   
});
