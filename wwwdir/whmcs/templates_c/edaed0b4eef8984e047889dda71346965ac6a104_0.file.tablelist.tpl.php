<?php
/* Smarty version 4.5.3, created on 2026-03-24 18:32:53
  from '/home/venom/wwwdir/whmcs/templates/six/includes/tablelist.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '4.5.3',
  'unifunc' => 'content_69c2d8d56103e4_92263026',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'edaed0b4eef8984e047889dda71346965ac6a104' => 
    array (
      0 => '/home/venom/wwwdir/whmcs/templates/six/includes/tablelist.tpl',
      1 => 1773235103,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_69c2d8d56103e4_92263026 (Smarty_Internal_Template $_smarty_tpl) {
?><link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH_CSS']->value;?>
/dataTables.bootstrap.css">
<link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH_CSS']->value;?>
/dataTables.responsive.css">
<?php echo '<script'; ?>
 type="text/javascript" charset="utf8" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH_JS']->value;?>
/jquery.dataTables.min.js"><?php echo '</script'; ?>
>
<?php echo '<script'; ?>
 type="text/javascript" charset="utf8" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH_JS']->value;?>
/dataTables.bootstrap.min.js"><?php echo '</script'; ?>
>
<?php echo '<script'; ?>
 type="text/javascript" charset="utf8" src="<?php echo $_smarty_tpl->tpl_vars['BASE_PATH_JS']->value;?>
/dataTables.responsive.min.js"><?php echo '</script'; ?>
>

<?php if ((isset($_smarty_tpl->tpl_vars['filterColumn']->value)) && $_smarty_tpl->tpl_vars['filterColumn']->value) {
echo '<script'; ?>
 type="text/javascript">

if (typeof(buildFilterRegex) !== "function") {
    function buildFilterRegex(filterValue) {

        if (filterValue.indexOf('&') === -1) {
            return '[~>]\\s*' + jQuery.fn.dataTable.util.escapeRegex(filterValue) + '\\s*[<~]';
        } else {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = filterValue;

            return '\\s*' + jQuery.fn.dataTable.util.escapeRegex(tempDiv.innerText) + '\\s*';
        }
    }
}
jQuery(document).ready(function () {
    jQuery(".view-filter-btns a").click(function(e) {
        var filterValue = jQuery(this).find("span").not('.badge').html().trim();
        var dataTable = jQuery('#table<?php echo $_smarty_tpl->tpl_vars['tableName']->value;?>
').DataTable();
        var filterValueRegex;
        if (jQuery(this).hasClass('active')) {
            <?php if (!(isset($_smarty_tpl->tpl_vars['dontControlActiveClass']->value)) || !$_smarty_tpl->tpl_vars['dontControlActiveClass']->value) {?>
                jQuery(this).removeClass('active');
                jQuery(this).find("i.far.fa-dot-circle").removeClass('fa-dot-circle').addClass('fa-circle');
            <?php }?>
            dataTable.column(<?php echo $_smarty_tpl->tpl_vars['filterColumn']->value;?>
).search('').draw();
        } else {
            <?php if (!(isset($_smarty_tpl->tpl_vars['dontControlActiveClass']->value)) || !$_smarty_tpl->tpl_vars['dontControlActiveClass']->value) {?>
                jQuery('.view-filter-btns .list-group-item').removeClass('active');
                jQuery('i.far.fa-dot-circle').removeClass('fa-dot-circle').addClass('fa-circle');
                jQuery(this).addClass('active');
                jQuery(this).find(jQuery("i.far.fa-circle")).removeClass('fa-circle').addClass('fa-dot-circle');
            <?php }?>
            filterValueRegex = buildFilterRegex(filterValue);
            dataTable.column(<?php echo $_smarty_tpl->tpl_vars['filterColumn']->value;?>
)
                .search(filterValueRegex, true, false, false)
                .draw();
        }

        // Prevent jumping to the top of the page
        // when no matching tag is found.
        e.preventDefault();
    });
});
<?php echo '</script'; ?>
>
<?php }?>

<?php echo '<script'; ?>
 type="text/javascript">
var alreadyReady = false; // The ready function is being called twice on page load.
jQuery(document).ready( function () {
    var table = jQuery("#table<?php echo $_smarty_tpl->tpl_vars['tableName']->value;?>
").DataTable({
        "dom": '<"listtable"fit>pl',<?php if ((isset($_smarty_tpl->tpl_vars['noPagination']->value)) && $_smarty_tpl->tpl_vars['noPagination']->value) {?>
        "paging": false,<?php }
if ((isset($_smarty_tpl->tpl_vars['noInfo']->value)) && $_smarty_tpl->tpl_vars['noInfo']->value) {?>
        "info": false,<?php }
if ((isset($_smarty_tpl->tpl_vars['noSearch']->value)) && $_smarty_tpl->tpl_vars['noSearch']->value) {?>
        "filter": false,<?php }
if ((isset($_smarty_tpl->tpl_vars['noOrdering']->value)) && $_smarty_tpl->tpl_vars['noOrdering']->value) {?>
        "ordering": false,<?php }?>
        "responsive": true,
        "oLanguage": {
            "sEmptyTable":     "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['norecordsfound'];?>
",
            "sInfo":           "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['tableshowing'];?>
",
            "sInfoEmpty":      "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['tableempty'];?>
",
            "sInfoFiltered":   "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['tablefiltered'];?>
",
            "sInfoPostFix":    "",
            "sInfoThousands":  ",",
            "sLengthMenu":     "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['tablelength'];?>
",
            "sLoadingRecords": "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['tableloading'];?>
",
            "sProcessing":     "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['tableprocessing'];?>
",
            "sSearch":         "",
            "sZeroRecords":    "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['norecordsfound'];?>
",
            "oPaginate": {
                "sFirst":    "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['tablepagesfirst'];?>
",
                "sLast":     "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['tablepageslast'];?>
",
                "sNext":     "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['tablepagesnext'];?>
",
                "sPrevious": "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['tablepagesprevious'];?>
"
            }
        },
        "pageLength": 10,
        "order": [
            [ <?php if ((isset($_smarty_tpl->tpl_vars['startOrderCol']->value)) && $_smarty_tpl->tpl_vars['startOrderCol']->value) {
echo $_smarty_tpl->tpl_vars['startOrderCol']->value;
} else { ?>0<?php }?>, "asc" ]
        ],
        "lengthMenu": [
            [10, 25, 50, -1],
            [10, 25, 50, "<?php echo $_smarty_tpl->tpl_vars['LANG']->value['tableviewall'];?>
"]
        ],
        "aoColumnDefs": [
            {
                "bSortable": false,
                "aTargets": [ <?php if ((isset($_smarty_tpl->tpl_vars['noSortColumns']->value)) && $_smarty_tpl->tpl_vars['noSortColumns']->value !== '') {
echo $_smarty_tpl->tpl_vars['noSortColumns']->value;
}?> ]
            },
            {
                "sType": "string",
                "aTargets": [ <?php if ((isset($_smarty_tpl->tpl_vars['filterColumn']->value)) && $_smarty_tpl->tpl_vars['filterColumn']->value) {
echo $_smarty_tpl->tpl_vars['filterColumn']->value;
}?> ]
            }
        ],
        "stateSave": true
    });

    <?php if ((isset($_smarty_tpl->tpl_vars['filterColumn']->value)) && $_smarty_tpl->tpl_vars['filterColumn']->value) {?>
    // highlight remembered filter on page re-load
    var rememberedFilterTerm = table.state().columns[<?php echo $_smarty_tpl->tpl_vars['filterColumn']->value;?>
].search.search;
    if (rememberedFilterTerm && !alreadyReady) {
        // This should only run on the first "ready" event.
        jQuery(".view-filter-btns a span").each(function(index) {
            if (buildFilterRegex(jQuery(this).text().trim()) == rememberedFilterTerm) {
                jQuery(this).closest('a').addClass('active');
                jQuery(this).closest('a').find('i').removeClass('fa-circle').addClass('fa-dot-circle');
            }
        });
    }
    <?php }?>
alreadyReady = true;
} );
<?php echo '</script'; ?>
>
<?php }
}
