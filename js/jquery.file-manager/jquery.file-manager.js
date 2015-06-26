document.createElement('folder');
document.createElement('file');

var contextmenu = {
    general: [
        {
            name: 'refresh',
            img: 'images/create.png',
            title: 'create button',
            fun: function() {
                location.reload();
            }
        }, {
            name: 'sort',
            img: 'images/update.png',
            title: 'update button',
            subMenu: [
                {
                    name: 'sort by name',
                    title: 'It will merge row',
                    img: 'images/merge.png',
                    fun: function() {
                        fn.renderSorted(['type', 'name', 'extension'], true);
                    }
                }, {
                    name: 'sort by file type',
                    title: 'It will replace row',
                    img: 'images/replace.png',
                    fun: function() {
                        fn.renderSorted(['type', 'extension', 'name'], true);
                    }
                }
            ]
        }
    ],

    item: [
        {
            name: 'create',
            img: 'images/create.png',
            title: 'create button',
            fun: function() {
                alert('i am add button');
            }
        }, {
            name: 'update',
            img: 'images/update.png',
            title: 'update button',
            subMenu: [
                {
                    name: 'merge',
                    title: 'It will merge row',
                    img: 'images/merge.png',
                    fun: function() {
                        alert('It will merge row');
                    }
                }, {
                    name: 'replace',
                    title: 'It will replace row',
                    img: 'images/replace.png',
                    subMenu: [
                        {
                            name: 'replace top 100',
                            img: 'images/top.png',
                            fun: function() {
                                alert('It will replace top 100 rows');
                            }
                        }, {
                            name: 'replace all',
                            img: 'images/all.png',
                            fun: function() {
                                alert('It will replace all rows');
                            }
                        }
                    ]
                }
            ]
        }, {
            name: 'delete',
            img: 'images/delete.png',
            title: 'delete button',
            subMenu: [
                {
                    'name': 'soft delete',
                    img: 'images/soft_delete.png',
                    fun: function() {
                        alert('You can recover back');
                    }
                }, {
                    'name': 'hard delete',
                    img: 'images/hard_delete.png',
                    fun: function() {
                        alert('It will delete permanently');
                    }
                }
            ]
        }
    ]
};

var doc, explorer, files,
    folderTag, fileTag, tag,
    CTRL = false,
    CMND = false,
    selection = [],
    fn = {};

fn = (function(j) {
    return {
        initContextMenu: function() {
            explorer.find('.bg').contextMenu(contextmenu.general, {
                triggerOn: 'click',
                mouseClick: 'right'
            });

            j('folder, file').contextMenu(contextmenu.item, {
                triggerOn: 'click',
                mouseClick: 'right'
            });
        },

        getSelection: function() {
            selection = [];
            var selectedItems = explorer.find('.selected'),
                item;
            for (var a = 0; a < selectedItems.length; a++) {
                item = selectedItems.eq(a);
                selection.push(item.attr('id'));
            }
        },

        sort: function(array, propArray, asc) {
            array = array.sort(function(a, b) {
                if (asc) {
                    for (var i = 0; i < propArray.length; i++) {
                        if (a[propArray[i]] == b[propArray[i]]) {
                            continue;
                        }
                        return (a[propArray[i]] > b[propArray[i]]) ? 1 : -1;
                    }
                } else {
                    for (var i = 0; i < propArray.length; i++) {
                        if (a[propArray[i]] == b[propArray[i]]) {
                            continue;
                        }
                        return (a[propArray[i]] < b[propArray[i]]) ? 1 : ((a[propArray[i]] > b[propArray[i]]) ? -1 : 0);
                    }
                }
                return 0;
            });
        },

        renderExplorer: function(explr, filesArray) {
            explr.html('<div class="bg" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:0;"></div>');

            for (var i = 0; i < filesArray.length; i++) {
                var file = filesArray[i];
                if (file.type == 'directory') {
                    tag = folderTag.clone();
                    tag.html(file.name);
                } else if (file.type == 'file') {
                    tag = fileTag.clone();
                    tag.attr({
                        extension: file.extension
                    });
                    tag.html(file.name + '.' + file.extension);
                }

                tag.attr({
                    id: file.id
                }).data(file);

                explr.append(tag);
            }
            fn.initContextMenu();

            j('file,folder').draggable({
                revert: true,
                delay: 200
            });

            j('folder').droppable({
                hoverClass: 'selected',
                drop: function(event, ui) {
                    fn.drop(j(ui.draggable[0]), j(this));
                }
            });
        },

        renderSorted: function(sortBy, asc) {
            fn.sort(files, sortBy, asc);
            fn.renderExplorer(explorer, files);
        },

        drop: function(item, container) {
            console.clear();
            console.log(item.data());
            console.log(container.data());
        }
    }
})(jQuery);


var fileManager = function(jsonData, wrapper) {
    files = jsonData;

    (function(j) {

        doc = j(document).keydown(function(e) {
            CTRL = e.ctrlKey;
            CMND = e.metaKey;
        }).keyup(function(e) {
            CTRL = e.ctrlKey;
            CMND = e.metaKey;
        });

        explorer = j(wrapper);

        folderTag = j('<folder></folder>');
        fileTag = j('<file></file>');

        doc.delegate('folder, file', 'click', function() {
            var el = j(this);
            if (CTRL || CMND) {
                el.toggleClass('selected');
            } else {
                el.siblings().removeClass('selected');
                el.addClass('selected');
            }

            fn.getSelection();
        });

        fn.sort(files, ['type'], true);

        fn.renderExplorer(explorer, files);

        explorer.click(function() {
            if (!CTRL && !CMND) {
                j('.selected').removeClass('selected');
            }
            fn.getSelection();
        });

        //Calling context menu
        fn.initContextMenu();

    })(jQuery);
}