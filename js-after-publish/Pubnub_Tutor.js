function process(request) {
    const base64Codec = require('codec/base64');
    const query = require('codec/query_string');
    const console = require('console');
    const xhr = require('xhr');
    const pubnub = require('pubnub');
    const vault = require('vault');

    const senderName = 'PubNub Bot';
    
    const version = '2018-02-16';
    
    return vault.get("username").then((apiKey) => {
        const apiUrl = 'https://gateway.watsonplatform.net/assistant/api/v1/workspaces/'
        + workspaceId + '/message';
    
        const base64Encoded = base64Codec.btoa(watsonUsername + ':' + watsonPassword);
    
        // bot auth
        const apiAuth = 'Basic ' + base64Encoded;
    
        const payload = JSON.stringify({
            input: {
                text: request.message.text
            }
        });
    
        const queryParams = {
            version
        };
        console.log('call');
    
        const httpOptions = {
            as: 'json',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: apiAuth
            },
            body: payload,
            method: 'post'
        };
    
        const url = apiUrl + '?' + query.stringify(queryParams);
        
        return xhr.fetch(url, httpOptions)
        .then(response => {
            return response.json()
              .then(parsedResponse => {
                  request.message.sender = senderName;

                  if (parsedResponse.output.text.length > 0) {
                      request.message.text = parsedResponse.output.text[0];
                      request.message.snippet = parsedResponse.output.snippet;
                      pubnub.publish({
                          channel: request.message.channel,
                          message: request.message
                      });
                  } else {
                      request.message.text =
                          "Sorry I didn't understand that. " +
                          'Please check what I can do.';
                      pubnub.publish({
                          channel: request.message.channel,
                          message: parsedResponse.output.text
                      });
                  }

                  return request;

              })
              .catch(err => {
                  console.error('error during parsing', err);
              });
        })
        .catch(err => {
            console.error('error during XHR', err);
        });
    });

    
}
