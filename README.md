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
1. Description must contain url of the site on which the check will be run. It is made with marker #url, eg #url: example.org. This flag is required, otherwise filters-pr-check will generate an error.
2. Description can contain filter ids which would be used for the check. They can be specified after `#id:` marker, e.g: #id: 1, 2. This flag is optional, by default the checker will get all filters with recommended tags.

Full description example:
```
// website where filters would be checked
#url: https://example.org

// filters to be fetched for comparison (optional)
#filters: 1, 2
```

## TODO
- [ ] Publish tswebextension to npm and remove ./tswebextension directory
