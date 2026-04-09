use relm4::prelude::*;

pub struct CheckButtonNoLabel;

#[relm4::component(pub)]
impl SimpleComponent for CheckButtonNoLabel {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::CheckButton {}
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
