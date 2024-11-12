## install and run jekyll

build on macOS:
```bash
# install homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# check ruby
brew install chruby
brew install ruby-install
# reinstall ruby by homebrew.
ruby-install ruby 3.3.5
# https://jekyllrb.com/docs/installation/macos/
echo "source $(brew --prefix)/opt/chruby/share/chruby/chruby.sh" >> ~/.bash_profile
echo "source $(brew --prefix)/opt/chruby/share/chruby/auto.sh" >> ~/.bash_profile
echo "chruby ruby-3.3.5" >> ~/.bash_profile # run 'chruby' to see actual version
ruby -v # will print the install version.
gem install jekyll bundler jekyll-minifier
gem install github-pages
bundler install
bundle exec jekyll serve
```

