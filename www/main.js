
let identityEntrypoint = "https://identity.api.rackspacecloud.com/v2.0/tokens";

async function main() {

  // Load username and api key from local server
  let {username, apiKey} = await fetch("/config.json").then(res => res.json());

  // Load service catalog from identity.
  let {access} = await fetch(identityEntrypoint, {
    mode: "cors",
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      auth: { "RAX-KSKEY:apiKeyCredentials": {
        username: username,
        apiKey: apiKey
      }}
    })
  }).then(res => res.json());

  console.log(access);
  let endpoint;
  let token = access.token.id;
  for (let entry of access.serviceCatalog) {
    if (entry.name === "cloudMetrics") {
      endpoint = entry.endpoints[0];
      break;
    }
  }
  let url = endpoint.publicURL;
  console.log(endpoint, token);
  let query = "/metrics/search?query=rackspace.monitoring.entities.*.byte*";

  await fetch("/proxy/" + url + query, {
    mode: "cors",
    method: "GET",
    headers: {
      "Accept": "application/json",
      "X-Auth-Token": token
    }
  }).then(res => res.json());

}

main().catch(console.error);
