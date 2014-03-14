module.exports = function(grunt) {
    // 配置
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
		
		jshint:{
			all:['main.js']
		},
        //concat : {
         //   domop : {
           //     src: ['src/ajax.js', 'src/selector.js'],
             //   dest: 'dest/domop.js'
           // }
        //},
        uglify : {
            options : {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> author:hellangel*/\n',
				mangle : true
            },
            dist : {
				files : {
					'dest/js/main.js':['js/main.js'],
					'dest/js/dialog.js':['js/dialog.js'],
					'dest/js/login.js':['js/login.js'],
					'dest/js/paramcfg.js':['js/paramcfg.js'],
					'dest/js/player.js':['js/player.js'],
					'dest/js/tree.js':['js/tree.js'],
					'dest/js/user.js':['js/user.js'],
					
					'dest/lib/videoPlugin/js/VideoControl.js':['lib/videoPlugin/js/VideoControl.js'],
					'dest/lib/tools/app.js':['lib/tools/app.js']
				}
            }
        }
    });
    // 载入concat和uglify插件，分别对于合并和压缩
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // 注册任务
    grunt.registerTask('production', ['jshint','uglify']);
	grunt.registerTask('development', ['jshint']);
};