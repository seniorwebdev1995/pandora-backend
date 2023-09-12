#!/bin/sh
echo $CC_POST_BUILD_HOOK
if [ "$CC_POST_BUILD_HOOK" == '$APP_HOME/clean.sh' ]; then
  echo "============= BUILDING NESTJS APPLICATION ============="
  yarn build
  rm -rf $APP_HOME/src
  rm -rf $APP_HOME/.env
  rm -rf $APP_HOME/.env.exemple
  rm -rf $APP_HOME/.gitignore
  rm -rf $APP_HOME/.nvmrc
  rm -rf $APP_HOME/.prettierrc
  rm -rf $APP_HOME/nest-cli.json
  rm -rf $APP_HOME/package-lock.json
  rm -rf $APP_HOME/README.md
  rm -rf $APP_HOME/tsconfig.json
  rm -rf $APP_HOME/tsconfig.build.json
  rm -rf $APP_HOME/node_modules
  mv $APP_HOME/dist/* $APP_HOME/
  echo "============= CLEANING OVER ============="
  yarn install --production
else
  echo "cleaning script is meant to be executed on clever cloud server only"
fi
