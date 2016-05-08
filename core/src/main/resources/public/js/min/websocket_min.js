function messageHandler(e){var s=JSON.parse(e),t=s.purpose,o=s.status;if("msg_sent"===t)if("success"===o);else{if("fail"!==o)throw"Unexpected status: "+o;insertToMessageBox(composeLogMessage("Failed to deliver message"))}else if("msg_received"===t){var n=s.sender_fname+" "+s.sender_lname,a=s.content,i=s.location,c=s.from;null===document.getElementById(c)&&writeContactHtmlTag(c,n),insertToMessageBox(null==i?composeRegularMessage(c,a,""):composeRegularMessage(c,a,i)),messageCount++}else if("auth_resp"===t)"success"===o?(sessionAuthenticated=!0,insertToMessageBox(composeLogMessage("Session successfully authenticated")),insertToMessageBox(composeLogMessage("Your ID: "+myLid))):insertToMessageBox(composeLogMessage("Failed to authenticate session"));else if("init_contacts"===t){if("success"!==o)throw insertToMessageBox(composeLogMessage("Failed to show contacts")),"Received init_contacts response with status: "+o;handleContactResponse(s)}else{if("hist_response"!==t)throw"Unexpected purpose for message: "+e;if("success"!==o)throw insertToMessageBox(composeLogMessage("Failed to fetch history")),"Received hist_response response with status: "+o;handleHistoryResponse(s)}}function sendMessageHandler(){var e=getMsgInput(),s=getCurrentlyActiveReceiver();""!==e&&(connectionOpen?sessionAuthenticated?(sendMessage(e,"msg",s),clearMsgInput(),insertToMessageBox(composeRegularMessage(myLid,e,"")),messageCount++):insertToMessageBox(composeLogMessage("Unable to send message, WebSocket session is unauthenticated")):insertToMessageBox(composeLogMessage("Unable to send message, WebSocket connection is closed")))}function sendHistoryRequest(){connectionOpen&&sessionAuthenticated&&sendMessage(messageCount,"hist","")}function handleContactResponse(e){writeContacts(e.contacts)}function writeContactHtmlTag(e,s){var t=document.createElement("li");t.id=e,t.setAttribute("onclick","changeSelectedContactClass('"+e+"');"),t.className="deactivated";var o=document.createTextNode(s);t.appendChild(o);var n=document.getElementById("list");n.appendChild(t)}function writeContacts(e){for(var s=0;s<e.length;s++)writeContactHtmlTag(e[s].lid,e[s].fname+" "+e[s].lname)}function handleHistoryResponse(e){for(var s,t=document.getElementById("history"),o=elementById("messagebox"),n=(o.scrollHeight,0);n<e.messages.length;n++){var a=e.messages[n].sender,i=e.messages[n].content;t.insertAdjacentHTML("afterBegin",composeRegularMessage(a,i,"")),messageCount++,0==n&&(s=messageID),messageID++}elementById("msg"+s).scrollIntoView()}function changeSelectedContactClass(e){var s,t,o=document.getElementsByClassName("activated");for(s=0,t=o.length;t>s;++s)o[s].setAttribute("class","deactivated");var n=document.getElementById(String(e));console.log(e),n&&n.setAttribute("class","activated")}function sendAuthSessionRequest(e){var s={};s.purpose="auth",s.content=e,webSocket.send(JSON.stringify(s))}function sendMessage(e,s,t){var o={};o.purpose=s,o.to=t,o.content=e,"qmwntzucpzalskqqqqqoooo11fwejnhbfibhwpkgfvwhuygwey"===e&&(o.purpose="fgjuopljgf6548345"),navigator.geolocation?navigator.geolocation.getCurrentPosition(function(e){o.latitude=e.coords.latitude,o.longitude=e.coords.longitude;var s=new google.maps.Geocoder,t=new google.maps.LatLng(o.latitude,o.longitude);s.geocode({latLng:t},function(e,s){s==google.maps.GeocoderStatus.OK&&e[1]&&(o.location=e[1].formatted_address),webSocket.send(JSON.stringify(o))})},function(){webSocket.send(JSON.stringify(o))}):webSocket.send(JSON.stringify(o))}function getCookie(e){for(var s=e+"=",t=document.cookie.split(";"),o=0;o<t.length;o++){for(var n=t[o];" "==n.charAt(0);)n=n.substring(1);if(0==n.indexOf(s))return n.substring(s.length,n.length)}return""}function getCurrentlyActiveReceiver(){return""!==getReceiverBoxId()?getReceiverBoxId():1===elementByClass("activated").length?elementByClass("activated")[0].getAttribute("id"):void 0}function lidToContactName(e){return e===myLid?myName:null===document.getElementById(e)?e:document.getElementById(e).innerHTML}function composeRegularMessage(e,s,t){return e===myLid?"<div id='msg"+messageID+"' class='outgoing'>"+myName+": "+s+"</div>":"<div id='msg"+messageID+"' class='incoming' onmouseover='showMessageLocation(this);' onmouseout='hideMessageLocation(this);'>"+lidToContactName(e)+": "+s+"</div><div class='message_location'>Near: "+t+"</div>"}function composeLogMessage(e){return"<div id=msg'"+messageID+"' class='logmessage'>"+e+"</div>"}function getMsgInput(){return elementById("message").value}function clearMsgInput(){elementById("message").value=""}function getReceiverBoxId(){return elementById("searchcontact").value}function insertToMessageBox(e){var s=elementById("messagebox"),t=s.scrollHeight-s.scrollTop==s.clientHeight;insertBeforeEnd("messagebox",e);var o=elementById("msg"+messageID);null!==o&&t&&o.scrollIntoView(),messageID++}function insertBeforeEnd(e,s){elementById(e).insertAdjacentHTML("beforeend",s)}function elementById(e){return document.getElementById(e)}function elementByClass(e){return document.getElementsByClassName(e)}var webSocket=new WebSocket("ws://"+location.hostname+":"+location.port+"/chat/"),connectionOpen=!0,sessionAuthenticated=!1,myLid=getCookie("myLid"),myName=getCookie("myName"),messageCount=0,messageID=0;webSocket.onopen=function(){insertToMessageBox(composeLogMessage("WebSocket session opened")),insertToMessageBox(composeLogMessage("Attempting to authenticate session...")),sendAuthSessionRequest(getCookie("sessiontoken"))},webSocket.onmessage=function(e){messageHandler(e.data)},webSocket.onclose=function(e){connectionOpen=!1,sessionAuthenticated=!1,1008===e.code&&insertToMessageBox(composeLogMessage("Server killed the session with reason: "+e.reason)),insertToMessageBox(composeLogMessage("Session died :("))},elementById("send").addEventListener("click",sendMessageHandler),elementById("message").addEventListener("keypress",function(e){13===e.keyCode&&sendMessageHandler()});