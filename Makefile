all: compile

compile:
	npm run webpack

init:
	npm install

package: init compile
	zip -r -FS ./package.zip ./* -x ./package.zip -x \*node_modules\*
