package com.securities.impl;

import java.io.IOException;

import org.apache.commons.lang3.StringUtils;

import com.infrastructure.core.Validatable;
import com.securities.api.PersonNaming;
import com.securities.api.Sex;

public final class ContactPersonValidation implements Validatable {

	private transient final String firstName;
	private transient final String lastName;
	private transient final PersonNaming naming;
	private transient final Sex sex;
	
	public ContactPersonValidation(String firstName, String lastName, PersonNaming naming, Sex sex){
		this.firstName = firstName;
		this.lastName = lastName;
		this.naming = naming;
		this.sex = sex;
	}
	
	@Override
	public void validate() throws IOException {
		
		if(StringUtils.isBlank(firstName))
			throw new IllegalArgumentException("Vous devez fournir un prénom !");
		
		if(StringUtils.isBlank(lastName))
			throw new IllegalArgumentException("Vous devez fournir un nom !");
		
		if(naming == PersonNaming.NONE)
			throw new IllegalArgumentException("Vous devez spécifier un modèle d'affichage de nom !");
		
		if(sex == Sex.NONE)
			throw new IllegalArgumentException("Vous devez indiquer le genre du contact !");
				
	}
}
