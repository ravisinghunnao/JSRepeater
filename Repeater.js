var $hw = function (appId, extend) {
    var parser = new DOMParser();

    this.o = extend
    var $ = function (selector) {
        return document.querySelectorAll(selector)
    }
    this.appId = appId;
    this.app = $("*[hw-app=" + appId + "]")[0]
    this.html = $("*[hw-app=" + appId + "]")[0].innerHTML
    this.if = function (exp) {
        exp = exp.replace(/#/gi,"'")
        return eval(exp)
    }

    var self = this;
    
    this.run = function () {
        buildHTML()
    
        self.app.innerHTML = self.html;
        
        var r = document.querySelector("*[hw-app=" + self.appId + "]")
        
        //bind repeater
        bindRepeater(r)
        //end repeater
        //bind models

        r.innerHTML=bindModels(r)
      
        //end bind models

        //execute expressions
        r.innerHTML = generateHTML(r.innerHTML)
        //end execute expressions
        r.querySelectorAll("*[hw-show=false]").forEach(function (i) {
            i.style.display="none"
        })
        r.querySelectorAll("*[hw-model]").forEach(function (i) {
            i.value = eval("self.o." + i.getAttribute("hw-model"))

        })
    }
    function buildHTML() {
        var elements = parser.parseFromString("<div id='parent'>" + self.html + "</div>", "text/html");
        
        var i = 0;
        elements.querySelector("#parent").querySelectorAll("*").forEach(function (elm) {
            var text = elm.innerHTML ? elm.innerHTML : elm.value

            if (text != undefined && text.search("{{") >= 0) {
                i++ 
                elm.setAttribute("hw-element", "hw-" + i)
            }
        })
        self.html = elements.querySelector("#parent").innerHTML
        
    }

    function bindRepeater(r){
        while (r.querySelector("*[hw-repeat]") != null) {
            bindInnerElement(r)

        }
    }

    function bindModels(r) {
        var html = r.innerHTML
        var dataHTML = ""
        var arr = html.split("}}");
        for (var i = 0; i < arr.length; i++) {
            var value = (arr[i].split("{{"))[1]


            if (value != undefined) {

                if (eval("self.o." + value) != undefined) {
                    dataHTML += (arr[i].replace("{{" + value, eval("self.o." + value)));
                }
                else {
                    dataHTML += arr[i] + "}}";
                }
            }
            else {
                dataHTML += (arr[i].replace("{{" + value, eval("self.o." + value)));
            }
        }

        return dataHTML
    }

    function generateRepeated(r) {
        var html = r.innerHTML
        var dataHTML = ""
        var dataLoop = r.getAttribute("hw-repeat")
        var loopArray = dataLoop.replace(/  /gi, ' ').split(" ")
        
        var da = loopArray[0]
        var data = eval("self.o." + loopArray[2])
        
        r.removeAttribute("hw-repeat");
        if (data != null) {

           // var filter = r.getAttribute("hw-filter")
            
            data.forEach(function (d) {
                /*
                if (filter) {
                    fdataHTML=""
                    var farr = filter.split("}}");
                    for (var i = 0; i < farr.length; i++) {
                        var fvalue = (farr[i].split("{{"))[1]
                        

                        if (fvalue != undefined) {

                            if (eval("self.o." + fvalue) != undefined) {
                                fdataHTML += (farr[i].replace("{{" +  fvalue, eval("self.o." + fvalue)));
                            }
                            else {
                                fdataHTML += farr[i] + "}}";
                            }
                        }
                        else {
                            fdataHTML += (farr[i].replace("{{"  + fvalue, eval("self.o." + fvalue)));
                        }
                    }

                    if ((eval(fdataHTML.replace(new RegExp(da+'.','g'), "d."))) == false) {
                        return
                    }

                }
                */
                
                var arr = html.split("}}");
                for (var i = 0; i < arr.length; i++) {
                    var value = (arr[i].split("{{"))[1]
                    if (value != undefined) {
                        value = value.replace(da + ".", "")
                    }
                    
                    if (value != undefined) {

                        if (eval("d." + value) != undefined) {
                            dataHTML += (arr[i].replace("{{" + da + "." + value, eval("d." + value)));
                        }
                        else {
                            dataHTML += arr[i] + "}}";
                        }
                    }
                    else {
                        dataHTML += (arr[i].replace("{{" + da + "." + value, eval("d." + value)));
                    }
                }
            })
        }
        dataHTML = generateHTML(dataHTML)
        return dataHTML
    }

    function saveModels(r) {
        r.querySelectorAll("*[hw-model]").forEach(function (i) {
            eval("self.o." + i.getAttribute("hw-model") + "='" + i.value+"'")
            
        })
    }

    this.update = function (sender) {
        
        var parser = new DOMParser()
      var elements=  parser.parseFromString(self.html,"text/html")
        var modelName = sender.getAttribute("hw-model")
       
        elements.querySelectorAll("*[hw-element]").forEach(function (elm) {
            if (elm.innerHTML != undefined) {
                if (elm.innerHTML == "{{" + modelName + "}}") {

                    self.app.querySelectorAll("*[hw-element=" + elm.getAttribute("hw-element") + "]").forEach(function (s) {

                        if (s.innerHTML != undefined) {
                            s.innerHTML = sender.value
                        }
                        if (s.value != undefined) {
                            s.value = sender.value
                        }


                    })
                }
            }


            if (elm.value != undefined) {
                if (elm.value == "{{" + modelName + "}}") {

                    self.app.querySelectorAll("*[hw-element=" + elm.getAttribute("hw-element") + "]").forEach(function (s) {

                        if (s.innerHTML != undefined) {
                            s.innerHTML = sender.value
                        }
                        if (s.value != undefined) {
                            s.value = sender.value
                        }


                    })
                }
            }

        })

      
    }

    function generateHTML(html) {
        var leftBrace = "[[", rightBrace = "]]"
        var dataHTML = ""
        var arr = html.split(rightBrace);
        for (var i = 0; i < arr.length; i++) {
            var value = (arr[i].split(leftBrace))[1]
            dataHTML += (arr[i].replace(leftBrace + value, eval(value)));
        }
        return dataHTML
    }
    function bindInnerElement(r) {
        if (r.querySelector("*[hw-repeat]") == null) {
            r.innerHTML = generateRepeated(r)
        }
        else {
            r = r.querySelector("*[hw-repeat]")
            bindInnerElement(r);
        }
    }

    
    
}
