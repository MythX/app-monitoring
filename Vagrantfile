# -*- mode: ruby -*-
# vi: set ft=ruby :


VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

	if Vagrant.has_plugin?("vagrant-proxyconf")
		config.proxy.http      = "http://proxy.priv.atos.fr:3128/"
		config.proxy.https     = "http://proxy.priv.atos.fr:3128/"
		config.proxy.https     = "http://proxy.priv.atos.fr:3128/"
		config.proxy.no_proxy  = "localhost,127.0.0.1"
	end

	config.vm.box = "hashicorp/precise32"
	config.vm.provision :shell, :privileged => true,  :path => "bootstrap_root.sh"
	config.vm.provision :shell, :privileged => false, :path => "bootstrap_user.sh"

	config.vm.network "forwarded_port", guest:  8080, host:  8080
	config.vm.network "forwarded_port", guest: 27017, host: 27017
	config.vm.network "forwarded_port", guest: 28017, host: 28017
end

