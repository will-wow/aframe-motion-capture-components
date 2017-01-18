!function(t){function e(i){if(r[i])return r[i].exports;var o=r[i]={exports:{},id:i,loaded:!1};return t[i].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){if("undefined"==typeof AFRAME)throw new Error("Component attempted to register before AFRAME was available.");r(1),r(2),r(3),r(4)},function(t,e){AFRAME.registerComponent("motion-capture-recorder",{schema:{enabled:{default:!0},hand:{default:"right"},visibleStroke:{default:!0},persistStroke:{default:!0}},init:function(){var t=this.el;this.onTriggerChanged=this.onTriggerChanged.bind(this),this.drawing=!1,t.addEventListener("buttonchanged",this.onTriggerChanged.bind(this))},onTriggerChanged:function(t){var e;if(this.data.enabled&&1===t.detail.id)return e=t.detail.state.value,e<=.1?void(this.recordingStroke&&this.finishStroke()):void(this.recordingStroke||this.startNewStroke())},getStrokeJSON:function(){if(this.currentStroke)return this.system.getStrokeJSON(this.currentStroke)},saveCapture:function(){var t=this.getStrokeJSON(),e=new Blob([t],{type:"application/json"}),r=URL.createObjectURL(e),i="motion-capture-"+document.title+"-"+Date.now()+".json",o=document.createElement("a");o.href=r,o.setAttribute("download",i),o.innerHTML="downloading...",o.style.display="none",document.body.appendChild(o),setTimeout(function(){o.click(),document.body.removeChild(o)},1)},update:function(){var t=this.el,e=this.data;t.setAttribute("vive-controls",{hand:e.hand}),t.setAttribute("oculus-touch-controls",{hand:e.hand}),t.setAttribute("stroke",{hand:e.hand})},tick:function(){var t=new THREE.Vector3,e=new THREE.Quaternion,r=new THREE.Vector3;return function(i,o){var n,s;this.data.enabled&&this.recordingStroke&&(this.el.object3D.matrixWorld.decompose(t,e,r),n={position:t.clone(),rotation:e.clone(),timestamp:i},this.currentStroke.push(n),s=this.getPointerPosition(t,e),this.data.visibleStroke&&this.el.components.stroke.drawPoint(n.position,n.rotation,n.timestamp,s))}}(),getPointerPosition:function(){var t=new THREE.Vector3,e=new THREE.Vector3(0,.7,1);return function(r,i){var o=e.clone().applyQuaternion(i).normalize().multiplyScalar(-.03);return t.copy(r).add(o),t}}(),startNewStroke:function(){var t=this.el;t.components.stroke.reset(),this.recordingStroke=!0,this.currentStroke=this.system.addNewStroke(),t.emit("strokestarted",{entity:t,stroke:this.currentStroke})},finishStroke:function(){var t=this.el;t.emit("strokeended",{stroke:this.currentStroke}),this.recordingStroke=!1,this.data.persistStroke||t.components.stroke.reset()}})},function(t,e){AFRAME.registerComponent("motion-capture-player",{schema:{enabled:{default:!0},recorderEl:{type:"selector"},src:{default:"/assets/motion-capture-test.json"}},init:function(){this.onStrokeStarted=this.onStrokeStarted.bind(this),this.onStrokeEnded=this.onStrokeEnded.bind(this)},update:function(t){var e=this.data;this.updateRecorder(e.recorderEl,t.recorderEl),t.src!==e.src&&e.src&&this.updateSrc(e.src)},updateRecorder:function(t,e){e&&e!==t&&(e.removeEventListener("strokestarted",this.onStrokeStarted),e.removeEventListener("strokeended",this.onStrokeEnded)),t&&e!==t&&(t.addEventListener("strokestarted",this.onStrokeStarted),t.addEventListener("strokeended",this.onStrokeEnded))},updateSrc:function(t){function e(t){r.playStroke(t)}var r=this;this.el.sceneEl.systems["motion-capture-recorder"].loadStrokeFromUrl(t,!1,e)},onStrokeStarted:function(t){this.reset()},onStrokeEnded:function(t){this.playStroke(t.detail.stroke)},play:function(){this.playingStroke&&this.playStroke(this.playingStroke)},playStroke:function(t){this.playingStroke=t,this.currentTime=t.timestamp,this.currentPoseIndex=0},reset:function(){this.playingStroke=null,this.currentTime=void 0,this.currentPoseIndex=void 0},applyPose:function(t){var e=new THREE.Euler;return function(t){var r=this.el;e.setFromQuaternion(t.rotation),r.setAttribute("position",t.position),r.setAttribute("rotation",e)}}(),tick:function(){new THREE.Vector3,new THREE.Quaternion,new THREE.Vector3;return function(t,e){var r=this.playingStroke;r&&(this.currentTime?this.currentTime+=e:this.currentTime=r[0].timestamp,this.currentTime>=this.playingStroke[this.currentPoseIndex].timestamp&&(this.currentPoseIndex+=1,this.currentPoseIndex===r.length&&(this.currentPoseIndex=0,this.currentTime=r[0].timestamp)),this.applyPose(r[this.currentPoseIndex]))}}()})},function(t,e){AFRAME.registerComponent("stroke",{schema:{enabled:{default:!0},color:{default:"#ef2d5e",type:"color"}},init:function(){var t,e=this.maxPoints=3e3;this.idx=0,this.numPoints=0,this.vertices=new Float32Array(3*e*3),this.normals=new Float32Array(3*e*3),this.uvs=new Float32Array(2*e*2),this.geometry=new THREE.BufferGeometry,this.geometry.setDrawRange(0,0),this.geometry.addAttribute("position",new THREE.BufferAttribute(this.vertices,3).setDynamic(!0)),this.geometry.addAttribute("uv",new THREE.BufferAttribute(this.uvs,2).setDynamic(!0)),this.geometry.addAttribute("normal",new THREE.BufferAttribute(this.normals,3).setDynamic(!0)),this.material=new THREE.MeshStandardMaterial({color:this.data.color,roughness:.75,metalness:.25,side:THREE.DoubleSide});var r=new THREE.Mesh(this.geometry,this.material);r.drawMode=THREE.TriangleStripDrawMode,r.frustumCulled=!1,t=document.createElement("a-entity"),t.setObject3D("stroke",r),this.el.sceneEl.appendChild(t)},update:function(){this.material.color.set(this.data.color)},drawPoint:function(){var t=new THREE.Vector3,e=new THREE.Vector3,r=new THREE.Vector3;new THREE.Vector3,new THREE.Vector3;return function(o,n,s,a){var h=0,d=this.numPoints,c=.01;if(d!==this.maxPoints){for(i=0;i<d;i++)this.uvs[h++]=i/(d-1),this.uvs[h++]=0,this.uvs[h++]=i/(d-1),this.uvs[h++]=1;return t.set(1,0,0),t.applyQuaternion(n),t.normalize(),e.copy(a),r.copy(a),e.add(t.clone().multiplyScalar(c/2)),r.add(t.clone().multiplyScalar(-c/2)),this.vertices[this.idx++]=e.x,this.vertices[this.idx++]=e.y,this.vertices[this.idx++]=e.z,this.vertices[this.idx++]=r.x,this.vertices[this.idx++]=r.y,this.vertices[this.idx++]=r.z,this.computeVertexNormals(),this.geometry.attributes.normal.needsUpdate=!0,this.geometry.attributes.position.needsUpdate=!0,this.geometry.attributes.uv.needsUpdate=!0,this.geometry.setDrawRange(0,2*d),this.numPoints+=1,!0}}}(),reset:function(){var t=0,e=this.vertices;for(i=0;i<this.numPoints;i++)e[t++]=0,e[t++]=0,e[t++]=0,e[t++]=0,e[t++]=0,e[t++]=0;this.geometry.setDrawRange(0,0),this.idx=0,this.numPoints=0},computeVertexNormals:function(){for(var t=new THREE.Vector3,e=new THREE.Vector3,r=new THREE.Vector3,i=new THREE.Vector3,o=new THREE.Vector3,n=0,s=this.idx;n<s;n++)this.normals[n]=0;var a=!0;for(n=0,s=this.idx;n<s;n+=3)a?(t.fromArray(this.vertices,n),e.fromArray(this.vertices,n+3),r.fromArray(this.vertices,n+6)):(t.fromArray(this.vertices,n+3),e.fromArray(this.vertices,n),r.fromArray(this.vertices,n+6)),a=!a,i.subVectors(r,e),o.subVectors(t,e),i.cross(o),i.normalize(),this.normals[n]+=i.x,this.normals[n+1]+=i.y,this.normals[n+2]+=i.z,this.normals[n+3]+=i.x,this.normals[n+4]+=i.y,this.normals[n+5]+=i.z,this.normals[n+6]+=i.x,this.normals[n+7]+=i.y,this.normals[n+8]+=i.z;for(n=6,s=this.idx-6;n<s;n++)this.normals[n]=this.normals[n]/3;this.normals[3]=this.normals[3]/2,this.normals[4]=this.normals[4]/2,this.normals[5]=this.normals[5]/2,this.normals[this.idx-6]=this.normals[this.idx-6]/2,this.normals[this.idx-6+1]=this.normals[this.idx-6+1]/2,this.normals[this.idx-6+2]=this.normals[this.idx-6+2]/2,this.geometry.normalizeNormals()}})},function(t,e){AFRAME.registerSystem("motion-capture-recorder",{init:function(){this.strokes=[]},undo:function(){var t=this.strokes.pop();if(t){var e=t.entity;e.emit("stroke-removed",{entity:e}),e.parentNode.removeChild(e)}},clear:function(){for(var t=0;t<this.strokes.length;t++){var e=this.strokes[t].entity;e.parentNode.removeChild(e)}this.strokes=[]},generateRandomStrokes:function(t){function e(){return 2*Math.random()-1}for(var r=0;r<t;r++)for(var i=parseInt(500*Math.random()),o=this.addNewStroke(),n=new THREE.Vector3(e(),e(),e()),s=new THREE.Vector3,a=new THREE.Quaternion,h=.2,d=0;d<i;d++){s.set(e(),e(),e()),s.multiplyScalar(e()/20),a.setFromUnitVectors(n.clone().normalize(),s.clone().normalize()),n=n.add(s);var c=0,u=this.getPointerPosition(n,a);o.addPoint(n,a,u,h,c)}},addNewStroke:function(){var t=[];return this.strokes.push(t),t},getPointerPosition:function(){var t=new THREE.Vector3,e=new THREE.Vector3(0,.7,1);return function(r,i){var o=e.clone().applyQuaternion(i).normalize().multiplyScalar(-.03);return t.copy(r).add(o),t}}(),getJSON:function(){var t={version:VERSION,strokes:[],author:""};for(i=0;i<this.strokes.length;i++)t.strokes.push(this.strokes[i].getJSON(this));return t},getStrokeJSON:function(t){for(var e,r=[],i=0;i<t.length;i++)e=t[i],r.push({rotation:e.rotation.toArray(),position:e.position.toArray(),timestamp:e.timestamp});return JSON.stringify(r)},getBinary:function(){var t=[],e="apainter",r=this.strokes=[],i=e.length,o=new BinaryManager(new ArrayBuffer(i));o.writeString(e),o.writeUint16(VERSION),o.writeUint32(this.strokes.length),t.push(o.getDataView());for(var n=0;n<r.length;n++)t.push(this.getStrokeBinary(r[n]));return t},getStrokeBinary:function(t){var e=4+36*t.length,r=new BinaryManager(new ArrayBuffer(e));r.writeUint32(t.length);for(var i=0;i<t.length;i++){var o=t[i];r.writeFloat32Array(o.position.toArray()),r.writeFloat32Array(o.orientation.toArray()),r.writeUint32(o.timestamp)}return r.getDataView()},loadJSON:function(t){var e;t.version!==VERSION&&console.error("Invalid version: ",version,"(Expected: "+VERSION+")");for(var r=0;r<t.strokes.length;r++)e=t.strokes[r],this.loadStrokeJSON(t.strokes[r])},loadStrokeJSON:function(t){for(var e,r=this.addNewStroke(),i=0;i<t.length;i++)e=t[i],r.push({position:(new THREE.Vector3).fromArray(e.position),rotation:(new THREE.Vector3).fromArray(e.rotation),timestamp:e.timestamp});return r},loadBinary:function(t){var e=new BinaryManager(t),r=e.readString();if("apainter"!==r)return void console.error("Invalid `magic` header");var i=e.readUint16();i!==VERSION&&console.error("Invalid version: ",i,"(Expected: "+VERSION+")");for(var o=e.readUint32(),n=0;n<o;n++)for(var s=e.readUint32(),a=this.addNewStroke(),h=0;h<s;h++){var d=e.readVector3();e.readQuaternion(),e.readUint32();a.push({position:d,rotation:rotation,timestamp:time})}},loadStrokeFromUrl:function(t,e,r){var i,o=new THREE.XHRLoader(this.manager),n=this;o.crossOrigin="anonymous",e===!0&&o.setResponseType("arraybuffer"),o.load(t,function(t){i=e===!0?n.loadStrokeBinary(t):n.loadStrokeJSON(JSON.parse(t)),r&&r(i)})},loadFromUrl:function(t,e){var r=new THREE.XHRLoader(this.manager),i=this;r.crossOrigin="anonymous",e===!0&&r.setResponseType("arraybuffer"),r.load(t,function(t){e===!0?i.loadBinary(t):i.loadJSON(JSON.parse(t))})}})}]);