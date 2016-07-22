! function() {
    "use strict";
    var module = angular.module("sticky", []);
    module.directive("sticky", ["$window", "$timeout", function($window, $timeout) {
        return {
            restrict: "A",
            scope: {
                disabled: "=disabledSticky"
            },
            link: function($scope, $elem, $attrs) {
                function initSticky() {
                    shouldInitialize && (scrollbarElement.on("scroll", checkIfShouldStick), windowElement.on("resize", $scope.$apply.bind($scope, onResize)), memorizeDimensions(), $scope.$watch(onDigest, onChange), $scope.$on("$destroy", onDestroy), shouldInitialize = !1)
                }

                function memorizeDimensions() {
                    initialCSS = $scope.getInitialDimensions(), isStickyLayoutDeferred && ($elem[0].getBoundingClientRect().height || (onStickyHeighUnbind = $scope.$watch(function() {
                        return $elem.height()
                    }, function(newValue, oldValue) {
                        newValue > 0 && (initialCSS = $scope.getInitialDimensions(), isStickyLayoutWatched || onStickyHeighUnbind())
                    })))
                }

                function deriveScrollingViewport(stickyNode) {
                    var match = findAncestorTag(scrollableNodeTagName, stickyNode);
                    return 1 === match.length ? match[0] : $window
                }

                function findAncestorTag(tag, context) {
                    var p, m = [],
                        n = context.parent();
                    do {
                        var node = n[0];
                        if (1 !== node.nodeType) break;
                        if (node.tagName.toUpperCase() === tag.toUpperCase()) return n;
                        p = n.parent(), n = p
                    } while (0 !== p.length);
                    return m
                }

                function shouldStickWithLimit(shouldApplyWithLimit) {
                    return "true" === shouldApplyWithLimit && $window.innerHeight - ($elem[0].offsetHeight + parseInt(offset)) < 0
                }

                function getClosest(scrollTop, stickyLine, stickyBottomLine) {
                    var closest = "top",
                        topDistance = Math.abs(scrollTop - stickyLine),
                        bottomDistance = Math.abs(scrollTop - stickyBottomLine);
                    return topDistance > bottomDistance && (closest = "bottom"), closest
                }

                function unStickElement(fromDirection) {
                    initialStyle && $elem.attr("style", initialStyle), isSticking = !1, initialCSS.width = $scope.getInitialDimensions().width, $body.removeClass(bodyClass), $elem.removeClass(stickyClass), $elem.addClass(unstickyClass), "top" === fromDirection ? ($elem.removeClass(bottomClass), $elem.css("z-index", 10).css("width", initialCSS.width).css("top", initialCSS.top).css("position", initialCSS.position).css("left", initialCSS.cssLeft).css("margin-top", initialCSS.marginTop).css("height", initialCSS.height)) : "bottom" === fromDirection && confine === !0 && ($elem.addClass(bottomClass), createPlaceholder(), $elem.css("z-index", 10).css("width", initialCSS.width).css("top", "").css("bottom", 0).css("position", "absolute").css("left", initialCSS.cssLeft).css("margin-top", initialCSS.marginTop).css("margin-bottom", initialCSS.marginBottom).css("height", initialCSS.height)), placeholder && fromDirection === anchor && placeholder.remove()
                }

                function stickElement(closestLine) {
                    isSticking = !0, $timeout(function() {
                        initialCSS.offsetWidth = $elem[0].offsetWidth
                    }, 0), $body.addClass(bodyClass), $elem.removeClass(unstickyClass), $elem.removeClass(bottomClass), $elem.addClass(stickyClass), createPlaceholder(), $elem.css("z-index", "10").css("width", $elem[0].offsetWidth + "px").css("position", "fixed").css("left", $elem.css("left").replace("px", "") + "px").css(anchor, offset + elementsOffsetFromTop(scrollbar) + "px").css("margin-top", 10), "bottom" === anchor && $elem.css("margin-bottom", 0)
                }

                function onResize() {
                    unStickElement(anchor), checkIfShouldStick()
                }

                function createPlaceholder() {
                    if (usePlaceholder) {
                        placeholder && placeholder.remove(), placeholder = angular.element("<div>");
                        var elementsHeight = $elem[0].offsetHeight,
                            computedStyle = $elem[0].currentStyle || window.getComputedStyle($elem[0]);
                        elementsHeight += parseInt(computedStyle.marginTop, 10), elementsHeight += parseInt(computedStyle.marginBottom, 10), elementsHeight += parseInt(computedStyle.borderTopWidth, 10), elementsHeight += parseInt(computedStyle.borderBottomWidth, 10), placeholder.css("height", $elem[0].offsetHeight + "px"), $elem.after(placeholder)
                    }
                }

                function isBottomedOut() {
                    return !!(confine && scrollbarYPos() > stickyBottomLine)
                }

                function elementsOffsetFromTop(element) {
                    var offset = 0;
                    return element.getBoundingClientRect && (offset = element.getBoundingClientRect().top), offset
                }

                function scrollbarYPos() {
                    var position;
                    return position = "undefined" != typeof scrollbar.scrollTop ? scrollbar.scrollTop : "undefined" != typeof scrollbar.pageYOffset ? scrollbar.pageYOffset : document.documentElement.scrollTop
                }

                function scrollbarHeight() {
                    var height;
                    return height = scrollbarElement[0] instanceof HTMLElement ? $window.getComputedStyle(scrollbarElement[0], null).getPropertyValue("height").replace(/px;?/, "") : $window.innerHeight, parseInt(height) || 0
                }

                function mediaQueryMatches() {
                    var mediaQuery = $attrs.mediaQuery || !1,
                        matchMedia = $window.matchMedia;
                    return mediaQuery && !(matchMedia("(" + mediaQuery + ")").matches || matchMedia(mediaQuery).matches)
                }

                function getCSS($el, prop) {
                    var val, el = $el[0],
                        computed = window.getComputedStyle(el),
                        prevDisplay = computed.display;
                    return el.style.display = "none", val = computed[prop], el.style.display = prevDisplay, val
                }
                var onStickyHeighUnbind, originalInitialCSS, originalOffset, placeholder, stickyLine, initialCSS, scrollableNodeTagName = "sticky-scroll",
                    initialPosition = $elem.css("position"),
                    initialStyle = $elem.attr("style") || "",
                    stickyBottomLine = 0,
                    isSticking = !1,
                    stickyClass = $attrs.stickyClass || "",
                    unstickyClass = $attrs.unstickyClass || "",
                    bodyClass = $attrs.bodyClass || "",
                    bottomClass = $attrs.bottomClass || "",
                    scrollbar = deriveScrollingViewport($elem),
                    windowElement = angular.element($window),
                    scrollbarElement = angular.element(scrollbar),
                    $body = angular.element(document.body),
                    $onResize = $scope.$apply.bind($scope, onResize),
                    usePlaceholder = "false" !== $attrs.usePlaceholder,
                    anchor = "bottom" === $attrs.anchor ? "bottom" : "top",
                    confine = "true" === $attrs.confine,
                    isStickyLayoutDeferred = void 0 !== $attrs.isStickyLayoutDeferred && "true" === $attrs.isStickyLayoutDeferred,
                    isStickyLayoutWatched = void 0 === $attrs.isStickyLayoutWatched || "true" === $attrs.isStickyLayoutWatched,
                    offset = $attrs.offset ? parseInt($attrs.offset.replace(/px;?/, "")) : 0,
                    shouldInitialize = !0,
                    checkIfShouldStick = function() {
                        if ($scope.disabled === !0 || mediaQueryMatches()) return isSticking && unStickElement(), !1;
                        var shouldStick, scrollbarPosition = scrollbarYPos();
                        shouldStick = "top" === anchor ? confine === !0 ? scrollbarPosition > stickyLine && scrollbarPosition <= stickyBottomLine : scrollbarPosition > stickyLine : scrollbarPosition <= stickyLine;
                        var closestLine = getClosest(scrollbarPosition, stickyLine, stickyBottomLine);
                        !shouldStick || shouldStickWithLimit($attrs.stickLimit) || isSticking ? !shouldStick && isSticking ? unStickElement(closestLine, scrollbarPosition) : confine && !shouldStick && (originalOffset = elementsOffsetFromTop($elem[0]), unStickElement(closestLine, scrollbarPosition)) : stickElement(closestLine)
                    },
                    onDestroy = function() {
                        scrollbarElement.off("scroll", checkIfShouldStick), windowElement.off("resize", $onResize), $onResize = null, $body.removeClass(bodyClass), placeholder && placeholder.remove()
                    },
                    onDigest = function() {
                        if ($scope.disabled === !0) return unStickElement();
                        var offsetFromTop = elementsOffsetFromTop($elem[0]);
                        return 0 === offsetFromTop ? offsetFromTop : "top" === anchor ? (originalOffset || offsetFromTop) - elementsOffsetFromTop(scrollbar) + scrollbarYPos() : offsetFromTop - scrollbarHeight() + $elem[0].offsetHeight + scrollbarYPos()
                    },
                    onChange = function(newVal, oldVal) {
                        var elemIsShowed = !!newVal,
                            elemWasHidden = !oldVal,
                            valChange = newVal !== oldVal || "undefined" == typeof stickyLine,
                            notSticking = !isSticking && !isBottomedOut();
                        if (valChange && notSticking && newVal > 0 && elemIsShowed) {
                            stickyLine = newVal - offset, elemIsShowed && elemWasHidden && $scope.updateStickyContentUpdateDimensions($elem[0].offsetWidth, $elem[0].offsetHeight), confine && $elem.parent().css({
                                position: "relative"
                            });
                            var parent = $elem.parent()[0],
                                parentHeight = parseInt(parent.offsetHeight) - (usePlaceholder ? 0 : $elem[0].offsetHeight),
                                marginBottom = parseInt($elem.css("margin-bottom").replace(/px;?/, "")) || 0,
                                elementsDistanceFromTop = elementsOffsetFromTop($elem[0]),
                                parentsDistanceFromTop = elementsOffsetFromTop(parent),
                                scrollbarDistanceFromTop = elementsOffsetFromTop(scrollbar),
                                elementsDistanceFromScrollbarStart = elementsDistanceFromTop - scrollbarDistanceFromTop,
                                elementsDistanceFromBottom = parentsDistanceFromTop + parentHeight - elementsDistanceFromTop;
                            stickyBottomLine = elementsDistanceFromScrollbarStart + elementsDistanceFromBottom - $elem[0].offsetHeight - marginBottom - offset + +scrollbarYPos(), checkIfShouldStick()
                        }
                    };
                $scope.getElement = function() {
                    return $elem
                }, $scope.getScrollbar = function() {
                    return scrollbar
                }, $scope.getInitialCSS = function() {
                    return initialCSS
                }, $scope.getAnchor = function() {
                    return anchor
                }, $scope.isSticking = function() {
                    return isSticking
                }, $scope.getOriginalInitialCSS = function() {
                    return originalInitialCSS
                }, $scope.processUnStickElement = function(anchor) {
                    unStickElement(anchor)
                }, $scope.processCheckIfShouldStick = function() {
                    checkIfShouldStick()
                }, $scope.getInitialDimensions = function() {
                    return {
                        zIndex: $elem.css("z-index"),
                        top: $elem.css("top"),
                        position: initialPosition,
                        marginTop: $elem.css("margin-top"),
                        marginBottom: $elem.css("margin-bottom"),
                        cssLeft: getCSS($elem, "left"),
                        width: $elem[0].offsetWidth,
                        height: $elem.css("height")
                    }
                }, $scope.updateStickyContentUpdateDimensions = function(width, height) {
                    width && height && (initSticky(), initialCSS.width = width + "px", initialCSS.height = height + "px")
                }, $timeout(function() {
                    originalInitialCSS = $scope.getInitialDimensions(), initSticky()
                }, 0)
            },
            controller: ["$scope", "$window", function($scope, $window) {
                this.resetLayout = function(newWidth, newHeight) {
                    function _resetScrollPosition() {
                        "top" === anchor && (scrollbar === $window ? $window.scrollTo(0, 0) : scrollbar.scrollTop > 0 && (scrollbar.scrollTop = 0))
                    }
                    var scrollbar = $scope.getScrollbar(),
                        initialCSS = $scope.getInitialCSS(),
                        anchor = $scope.getAnchor();
                    if ($scope.isSticking() && ($scope.processUnStickElement(anchor), $scope.processCheckIfShouldStick()), $scope.getElement().css({
                            width: "",
                            height: "",
                            position: "",
                            top: "",
                            zIndex: ""
                        }), initialCSS.position = $scope.getOriginalInitialCSS().position, delete initialCSS.offsetWidth, void 0 === newWidth && void 0 === newHeight) {
                        var e_bcr = $scope.getElement()[0].getBoundingClientRect();
                        newWidth = e_bcr.width, newHeight = e_bcr.height
                    }
                    $scope.updateStickyContentUpdateDimensions(newWidth, newHeight), _resetScrollPosition()
                }, this.getScrollbar = function() {
                    return $scope.getScrollbar()
                }
            }]
        }
    }]), window.matchMedia = window.matchMedia || function() {
        var warning = "angular-sticky: This browser does not support matchMedia, therefore the minWidth option will not work on this browser. Polyfill matchMedia to fix this issue.";
        return window.console && console.warn && console.warn(warning),
            function() {
                return {
                    matches: !0
                }
            }
    }()
}();