 self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('static').then(cache => {
            return cache.addAll(["./", "./images/logo192.png"])
        })
    )


}) 

self.addEventListener("fetch", e => {
    console.log(e, 'this is a fetch')
    if (e.request.url === 'https://swapi.dev/api/people/1/') {
        console.log('IIITSSS SWAPI')
        e.respondWith(
            new Promise((resolve, reject) => {

                openDB().then(myBlob => {
                    console.log(myBlob,'MY')
                    resolve(
                        new Response(myBlob.blob)
                    )
                }
                ).catch(err=> {
                    reject(console.error(err))
                })
            })
        )
    }
    else {
        e.respondWith(
            caches.match(e.request).then(respones => {
                if (respones) {
                    return respones
                } else {
                    return fetch(e.request)
                }
            }
            ))
    }
})


function openDB() {
    console.log('opppeeen')

    // Let us open our database
    var DBOpenRequest = self.indexedDB.open("myFile");

    return new Promise((resolve, rej) => {
        DBOpenRequest.onsuccess = function (event) {
            console.log('oopened')
            // store the result of opening the database in the db variable.
            // This is used a lot below
            db = DBOpenRequest.result;

            // Run the getData() function to get the data from the database
            resolve(getFile())
        };

        DBOpenRequest.onerror = function (event) {
            rej(console.log(event, 'errr'))
        }
    })

}

function getFile() {
    const dbName = 'myFile'
    const key = "video"
    // open a read/write db transaction, ready for retrieving the data
    var transaction = db.transaction([dbName], "readwrite");

    // report on the success of the transaction completing, when everything is done
    transaction.oncomplete = function (event) {
        console.log('opensucc')
    };

    transaction.onerror = function (event) {
        console.log('openerr' + event)
    };

    // create an object store on the transaction
    var objectStore = transaction.objectStore(dbName);

    // Make a request to get a record by key from the object store
    var objectStoreRequest = objectStore.get(key);
    var myRecord = new Promise((resolve, reject) => {


        objectStoreRequest.onsuccess = function (event) {
            // report the success of our request
            
            myRecord = objectStoreRequest.result;
            console.log(myRecord, 'myRecord objectStore req success')
            resolve(myRecord)
        };

        objectStoreRequest.onerror = function (event) {
        
            reject(myRecord)
        };
    })

    return myRecord

};

