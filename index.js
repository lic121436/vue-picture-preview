import lgPreview from './vue-picture-preview.vue'

export default {
    install: function (Vue, options) {
        // 添加的内容写在这个函数里面
        const LOGIC_EVENT_BUS = new Vue({
            data(){
                return {
                    LOGIC_PREVIEW : {
                        isTitleEnable: true,
                        isHorizontalNavEnable: true,
                        show: false,
                        loading : true,
                        current: {
                            title: '',
                            src: ''
                        },
                        list: []
                    }
                }
            }
        });

        window.LOGIC_EVENT_BUS = LOGIC_EVENT_BUS;

        Vue.component('lg-preview', lgPreview);

        const updateIndex = (list) => {
            list.forEach((item, index) => {
                item.index = index + 1;
            });
        }

        function getImage (src, previewItem) {
            const img = new window.Image();
            img.src = src;
            img.onload = function () {
                previewItem['naturalHeight'] = img.naturalHeight;
                previewItem['naturalWidth'] = img.naturalWidth;
                setTimeout(() => {
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.loading = false;
                }, 500);
            };
            img.error = function (e) {
                console.error(e);
            };
        }

        Vue.directive('preview', {
            bind: function (el, binding) {
                let previewItem = {
                    title: el.alt || '',
                    el: el,
                    index: 0,
                    src: binding.value
                };
                LOGIC_EVENT_BUS.LOGIC_PREVIEW.list.push(previewItem);
                updateIndex(LOGIC_EVENT_BUS.LOGIC_PREVIEW.list);
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.isTitleEnable = el.getAttribute('preview-title-enable')== "false" ? false : true;
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.isHorizontalNavEnable = el.getAttribute('preview-nav-enable')== "false" ? false : true;
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.show = true;
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.loading = true;
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.current = previewItem;
                    getImage(previewItem.src, previewItem);
                })
            },
            update: (el, oldValue) => {
                var previewItem = LOGIC_EVENT_BUS.LOGIC_PREVIEW.list.find((item) => {
                    return item.el === el;
                });
                if (!previewItem) return;
                previewItem.src = oldValue.value;
                previewItem.title = el.alt;
            },
            unbind: (el) => {
                if (el) {
                    LOGIC_EVENT_BUS.LOGIC_PREVIEW.list.forEach((item, index) => {
                        if (el === item.el) {
                            LOGIC_EVENT_BUS.LOGIC_PREVIEW.list.splice(index, 1);
                        }
                    });
                }
                updateIndex(LOGIC_EVENT_BUS.LOGIC_PREVIEW.list);
            }
        })
    }
};
