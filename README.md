# filters-pr-checker

## Description
Checks pull requests in the filtering repository running extension instance and adding screenshots before and after pull request

## Usage
### Add in your GitHub action

```
      - uses: adguardteam/filters-pr-checker@v1
        with:
          # Required
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          # Required
          # Imgur client id can be received on https://api.imgur.com
          imgur_client_id: ${{ secrets.IMGUR_CLIENT_ID }}
```

Add IMGUR_CLIENT_ID in the repository secrets. Action requires it in order to publish screenshots (GitHub doesn't allow to upload screenshots in the comments via api). How to register application and get client id can be read here https://api.imgur.com

### Pull Request description
Description should contain string with website url 
`#url: https://example.org`
Specify a list of filters (optional). By default, rules are taken from all modified files with a txt extension.
`#filters: tests/filter.txt; tests/filter2.txt`

## TODO
- [ ] Publish tswebextension to npm and remove ./tswebextension directory
