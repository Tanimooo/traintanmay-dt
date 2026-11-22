const {chromium}=require('playwright');const {spawn}=require('child_process');
const JOBS={access:5.6,intro:4.3,newchem:1.8,newlogin:1.8,newboard:1.8,outro:7.5};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1.5});
for(const [s,d] of Object.entries(JOBS)){ if(process.argv[2]&&process.argv[2]!==s)continue;
 await p.goto('http://localhost:8766/motion.html?s='+s,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-i','-','-vf','format=yuv420p','-c:v','libx264','-crf','16','clips/'+s+'.mp4']);
 const n=Math.round(d*30);
 for(let i=0;i<n;i++){await p.evaluate(t=>seek(t),i/30);ff.stdin.write(await p.screenshot({type:'jpeg',quality:92}));}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));console.log(s,n);}
await b.close();})();
