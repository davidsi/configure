# enumerate all the folders
#
for f in *; do
    if [[ -d $f ]]; then
        cd $f
        pwd
        ../configure/check-git.sh
        
        cd ..
    fi
done