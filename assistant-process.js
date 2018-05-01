function process(request) {
    const base64Codec = require('codec/base64');
    const query = require('codec/query_string');
    const console = require('console');
    const xhr = require('xhr');
    const pubnub = require('pubnub');
    

    /*
      TODO: fill values
    */
    const watsonUsername = 'e1da1f7b-eacd-4d68-86b4-d93b15523aef';
    const watsonPassword = 'Y8MojFn5MrQQ';
    const workspaceId = '5ebd9ea5-a166-4537-8b83-c583810ee0b7';
    const senderName = 'commmun';
    /*
      TODO: end fill values
    */

    let version = '2018-02-16';

    // bot api url
    let apiUrl = 'https://gateway.watsonplatform.net/assistant/api/v1/workspaces'
        + workspaceId + '/message';

    let base64Encoded = base64Codec.btoa(watsonUsername + ':' + watsonPassword);

    // bot auth
    let apiAuth = 'Basic ' + base64Encoded;

    let payload = JSON.stringify({
        input: {
            text: request.message.text
        }
    });

    let queryParams = {
        version
    };

    let httpOptions = {
        as: 'json',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: apiAuth
        },
        body: payload,
        method: 'post'
    };

    let url = apiUrl + '?' + query.stringify(queryParams);

    return xhr.fetch(url, httpOptions, false)
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
}
